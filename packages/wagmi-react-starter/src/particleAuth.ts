import { Connector, UserRejectedRequestError, normalizeChainId } from '@wagmi/core';
import type { Chain } from '@wagmi/core/chains';
import { providers } from 'ethers';
import { getAddress, hexValue } from 'ethers/lib/utils.js';
import type { ParticleNetwork, Config } from '@particle-network/auth';
import type { ParticleProvider } from '@particle-network/provider';

type Options = Config;

export class ParticleAuthConnector extends Connector<ParticleProvider, Options, providers.JsonRpcSigner> {
    readonly id = 'coinbaseWallet';
    readonly name = 'Coinbase Wallet';
    readonly ready = true;

    private client?: ParticleNetwork;
    private provider?: ParticleProvider;

    constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
        super({
            chains,
            options,
        });
    }

    async connect({ chainId }: { chainId?: number } = {}) {
        try {
            const provider = await this.getProvider();
            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            provider.on('disconnect', this.onDisconnect);

            this.emit('message', { type: 'connecting' });

            const accounts = await provider.enable();
            const account = getAddress(accounts[0] as string);
            // Switch to chain if provided
            let id = await this.getChainId();
            let unsupported = this.isChainUnsupported(id);
            if (chainId && id !== chainId) {
                const chain = await this.switchChain(chainId);
                id = chain.id;
                unsupported = this.isChainUnsupported(id);
            }

            return {
                account,
                chain: { id, unsupported },
                provider: new providers.Web3Provider(provider as unknown as providers.ExternalProvider),
            };
        } catch (error) {
            if ((error as any).code === 4011) throw new UserRejectedRequestError(error);
            throw error;
        }
    }

    async disconnect() {
        if (!this.provider) return;

        const provider = await this.getProvider();
        provider.removeListener('accountsChanged', this.onAccountsChanged);
        provider.removeListener('chainChanged', this.onChainChanged);
        provider.removeListener('disconnect', this.onDisconnect);
        provider.disconnect();
    }

    async getAccount() {
        const provider = await this.getProvider();
        const accounts = await provider.request({
            method: 'eth_accounts',
        });
        // return checksum address
        return getAddress(accounts[0] as string);
    }

    async getChainId() {
        await this.getProvider();
        return this.client!.auth.chainId();
    }

    async getProvider() {
        if (!this.provider) {
            const [{ ParticleNetwork }, { ParticleProvider }] = await Promise.all([
                import('@particle-network/auth'),
                import('@particle-network/provider'),
            ]);
            this.client = new ParticleNetwork(this.options);
            this.provider = new ParticleProvider(this.client.auth);
        }
        return this.provider;
    }

    async getSigner({ chainId }: { chainId?: number } = {}) {
        const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
        return new providers.Web3Provider(provider as unknown as providers.ExternalProvider, chainId).getSigner(
            account
        );
    }

    async isAuthorized() {
        try {
            const account = await this.getAccount();
            return !!account;
        } catch {
            return false;
        }
    }

    async switchChain(chainId: number) {
        const provider = await this.getProvider();
        const id = hexValue(chainId);
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: id }],
        });
        return (
            this.chains.find((x) => x.id === chainId) ?? {
                id: chainId,
                name: `Chain ${id}`,
                network: `${id}`,
                nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
                rpcUrls: { default: { http: [''] }, public: { http: [''] } },
            }
        );
    }

    protected onAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) this.emit('disconnect');
        else this.emit('change', { account: getAddress(accounts[0] as string) });
    };

    protected onChainChanged = (chainId: number | string) => {
        const id = normalizeChainId(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit('change', { chain: { id, unsupported } });
    };

    protected onDisconnect = () => {
        this.emit('disconnect');
    };
}
