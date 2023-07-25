import { LoginOptions, type Config, type ParticleNetwork } from '@particle-network/auth';
import { initializeConnector } from '@web3-react/core';
import { Connector, type Actions, type ProviderRpcError } from '@web3-react/types';

export interface ParticleConnectConstructorArgs {
    actions: Actions;
    options: Config;
    onError?: (error: Error) => void;
}

export class ParticleAuth extends Connector {
    public provider: any;
    private particle: ParticleNetwork | undefined;
    private readonly options: Config;
    private eagerConnection?: Promise<any>;

    constructor({ actions, options, onError }: ParticleConnectConstructorArgs) {
        super(actions, onError);
        this.options = options;
    }

    private onDisconnect = (error?: ProviderRpcError): void => {
        this.actions.resetState();
        if (error) this.onError?.(error);
    };

    private onChainChanged = (chainId: number | string): void => {
        this.actions.update({ chainId: Number(chainId) });
    };

    private onAccountsChanged = (accounts: string[]): void => {
        if (accounts.length === 0) {
            this.actions.resetState();
        } else {
            this.actions.update({ accounts });
        }
    };

    private setupEventListeners(): void {
        if (this.provider) {
            this.provider.on('disconnect', this.onDisconnect);
            this.provider.on('onChainChanged', this.onChainChanged);
            this.provider.on('accountsChanged', this.onAccountsChanged);
        }
    }

    private removeEventListeners(): void {
        if (this.provider) {
            this.provider.off('disconnect', this.onDisconnect);
            this.provider.off('onChainChanged', this.onChainChanged);
            this.provider.off('accountsChanged', this.onAccountsChanged);
        }
    }

    private async isomorphicInitialize() {
        if (this.eagerConnection) return;
        if (typeof window !== 'undefined') {
            const [{ ParticleNetwork }, { ParticleProvider }] = await (this.eagerConnection = Promise.all([
                import('@particle-network/auth'),
                import('@particle-network/provider'),
            ]));
            this.particle = new ParticleNetwork(this.options);
            this.provider = new ParticleProvider(this.particle.auth);
            this.setupEventListeners();
        }
    }

    private get connected(): boolean {
        return this.particle?.auth?.isLogin() ?? false;
    }

    async activate(params: LoginOptions): Promise<void> {
        const cancelActivation = this.actions.startActivation();

        await this.isomorphicInitialize();
        if (this.particle) {
            try {
                if (!this.connected) {
                    await this.particle.auth.login(params);
                }
                const account = await this.particle.evm.getAddress();
                this.actions.update({ chainId: this.particle.auth.getChainId(), accounts: [account!] });
            } catch (error) {
                cancelActivation();
            }
        } else {
            cancelActivation();
        }
    }

    async connectEagerly(): Promise<void> {
        const cancelActivation = this.actions.startActivation();

        try {
            await this.isomorphicInitialize();

            if (!this.provider || !this.connected) throw new Error('No existing connection');
            const accounts = await this.provider.request({ method: 'eth_accounts' });
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            this.actions.update({ chainId: Number(chainId), accounts });
        } catch (error) {
            cancelActivation();
            throw error;
        }
    }

    async deactivate(): Promise<void> {
        await this.particle?.auth?.logout();
        this.removeEventListeners();
        this.actions.resetState();
    }
}

export const [particleAuth, hooks] = initializeConnector<ParticleAuth>(
    (actions) =>
        new ParticleAuth({
            actions,
            options: {
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
                chainName: 'Ethereum', //optional: current chain name, default Ethereum.
                chainId: 1, //optional: current chain id, default 1.
                wallet: {
                    //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
                    displayWalletEntry: true, //show wallet entry when connect particle.
                },
            },
        })
);
