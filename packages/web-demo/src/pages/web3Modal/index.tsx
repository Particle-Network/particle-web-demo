import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Button, Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import './index.scss';
import { ParticleWalletConnector } from './particleWallet';

const chains = [mainnet, arbitrum, polygon];
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string;

const Content = () => {
    return (
        <div className="connect-content">
            <Web3Button />
        </div>
    );
};

const PageWeb3Modal = () => {
    const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: [
            new ParticleWalletConnector({
                chains,
                options: {
                    projectId: process.env.REACT_APP_PROJECT_ID as string,
                    clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                    appId: process.env.REACT_APP_APP_ID as string,
                    chainName: 'Ethereum',
                    chainId: 1,
                    wallet: {
                        displayWalletEntry: true,
                    },
                    securityAccount: {
                        promptSettingWhenSign: 1,
                        promptMasterPasswordSettingWhenLogin: 2,
                    },
                },
            }),
            ...w3mConnectors({ projectId, chains }),
        ],
        publicClient,
    });
    const ethereumClient = new EthereumClient(wagmiConfig, chains);

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <Content />
            </WagmiConfig>

            <Web3Modal
                projectId={projectId}
                ethereumClient={ethereumClient}
                walletImages={{
                    particle: 'https://static.particle.network/particle-icon.svg',
                }}
            />
        </>
    );
};
export default PageWeb3Modal;
