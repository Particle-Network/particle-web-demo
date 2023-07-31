import type { Config, LoginOptions, ParticleNetwork } from '@particle-network/auth';
import type { ParticleProvider } from '@particle-network/provider';
import { Connector } from '@wagmi/core';
import type { Chain } from '@wagmi/core/chains';
import { UserRejectedRequestError, createWalletClient, custom, getAddress } from 'viem';
import { Address, ConnectorData } from 'wagmi';

export type ParticleOptions = Config;

export class ParticleAuthConnector extends Connector<ParticleProvider, ParticleOptions> {
    readonly id = 'particleAuth';
    readonly name = 'Particle Auth';
    readonly ready = true;

    private client?: ParticleNetwork;
    private provider?: ParticleProvider;
    private loginOptions?: LoginOptions;

    constructor({
        chains,
        options,
        loginOptions,
    }: {
        chains?: Chain[];
        options: ParticleOptions;
        loginOptions?: LoginOptions;
    }) {
        super({
            chains,
            options,
        });
        this.loginOptions = loginOptions;
    }

    async connect({ chainId }: { chainId?: number } = {}): Promise<Required<ConnectorData>> {
        try {
            const provider = await this.getProvider();
            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            provider.on('disconnect', this.onDisconnect);

            this.emit('message', { type: 'connecting' });

            // Switch to chain if provided
            let id = await this.getChainId();
            let unsupported = this.isChainUnsupported(id);
            if (chainId && id !== chainId) {
                const chain = await this.switchChain(chainId);
                id = chain.id;
                unsupported = this.isChainUnsupported(id);
            }

            if (!this.client?.auth.isLogin()) {
                await this.client?.auth.login(this.loginOptions);
            }
            const account = await this.getAccount();

            return {
                account,
                chain: { id, unsupported },
            };
        } catch (error) {
            if ((error as any).code === 4011) throw new UserRejectedRequestError(error as Error);
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

    async getAccount(): Promise<Address> {
        const provider = await this.getProvider();
        const accounts = await provider.request({
            method: 'eth_accounts',
        });
        // return checksum address
        return getAddress(accounts[0] as string);
    }

    async getChainId(): Promise<number> {
        const provider = await this.getProvider();
        const chainId = await provider.request({ method: 'eth_chainId' });
        return Number(chainId);
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

    async getWalletClient({ chainId }: { chainId?: number } = {}) {
        const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
        const chain = this.chains.find((x) => x.id === chainId);
        if (!provider) throw new Error('provider is required.');
        return createWalletClient({
            account,
            chain,
            transport: custom(provider),
        });
    }

    async isAuthorized() {
        try {
            await this.getProvider();
            return this.client!!.auth.isLogin() && this.client!!.auth.walletExist();
        } catch {
            return false;
        }
    }

    async switchChain(chainId: number) {
        const provider = await this.getProvider();
        const id = `0x${chainId.toString(16)}`;
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
        const id = Number(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit('change', { chain: { id, unsupported } });
    };

    protected onDisconnect = () => {
        this.emit('disconnect');
    };
}
