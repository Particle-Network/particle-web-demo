import type { Config, ParticleNetwork } from '@particle-network/auth';
import type { ParticleProvider } from '@particle-network/provider';
import type { Chain } from '@wagmi/chains';
import { SwitchChainError, UserRejectedRequestError, createWalletClient, custom, getAddress, numberToHex } from 'viem';

import { ChainNotConfiguredForConnectorError } from '@wagmi/connectors';
import { Connector } from 'wagmi';

type Options = Config;

export class ParticleWalletConnector extends Connector<ParticleProvider, Options> {
    readonly id = 'particle';
    readonly name = 'Particle';
    readonly ready = true;

    #client?: ParticleNetwork;
    #provider?: ParticleProvider;

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

            if (!this.#client?.auth.isLogin()) {
                await this.#client?.auth.login({
                    preferredAuthType: 'email',
                    supportAuthTypes: 'all',
                });
            }
            
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
            };
        } catch (error: any) {
            if (error.code === 4001) {
                error.name = error.code.toString();
                throw new UserRejectedRequestError(error as Error);
            }

            throw error;
        }
    }

    async disconnect() {
        if (!this.#provider) return;

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
        const provider = await this.getProvider();
        const chainId = await provider.request({
            method: 'eth_chainId',
        });
        return Number(chainId);
    }

    async getProvider() {
        if (!this.#provider) {
            const [{ ParticleNetwork }, { ParticleProvider }] = await Promise.all([
                import('@particle-network/auth'),
                import('@particle-network/provider'),
            ]);
            // Workaround for Vite dev import errors
            // https://github.com/vitejs/vite/issues/7112
            this.#client = new ParticleNetwork(this.options);
            this.#provider = new ParticleProvider(this.#client.auth);
        }
        return this.#provider;
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
            return this.#client!.auth.isLogin();
        } catch {
            return false;
        }
    }

    async switchChain(chainId: number) {
        const provider = await this.getProvider();
        const id = numberToHex(chainId);

        try {
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
        } catch (error) {
            const chain = this.chains.find((x) => x.id === chainId);
            if (!chain)
                throw new ChainNotConfiguredForConnectorError({
                    chainId,
                    connectorId: this.id,
                });

            throw new SwitchChainError(error as Error);
        }
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
