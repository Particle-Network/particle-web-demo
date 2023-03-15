import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { ConnectorUpdate } from '@web3-react/types';
import { Config, ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';

export const injected = new InjectedConnector({ supportedChainIds: [1, 5] });

export const walletconnect = new WalletConnectConnector({
    chainId: 1,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    supportedChainIds: [1, 5],
});

export class ParticleConnector extends AbstractConnector {
    private particleNetwork: ParticleNetwork;
    private particleProvider: ParticleProvider | undefined;

    constructor(private config: Config) {
        super({ supportedChainIds: [1, 5] });
        this.particleNetwork = new ParticleNetwork(this.config);
    }
    async activate(): Promise<ConnectorUpdate<string | number>> {
        if (!this.particleProvider) {
            this.particleProvider = new ParticleProvider(this.particleNetwork.auth);
        }
        if (!this.particleNetwork.auth.isLogin()) {
            //TODO: connect with particle network, set your custom options
            await this.particleNetwork.auth.login({
                preferredAuthType: 'email',
            });
        }
        const account = await this.getAccount();
        const chainId = await this.getChainId();
        return {
            provider: this.particleProvider,
            account,
            chainId,
        };
    }
    async getProvider(): Promise<any> {
        return this.particleProvider;
    }
    async getChainId(): Promise<string | number> {
        return this.particleNetwork.auth.chainId();
    }
    async getAccount(): Promise<string | null> {
        if (this.particleProvider) {
            return this.particleProvider.request({ method: 'eth_accounts' }).then((accounts): string => accounts[0]);
        } else {
            return null;
        }
    }
    async deactivate() {
        await this.particleNetwork.auth.logout();
        this.emitDeactivate();
    }
}
