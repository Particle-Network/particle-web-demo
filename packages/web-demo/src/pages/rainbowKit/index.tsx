import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    coinbaseWallet,
    imTokenWallet,
    injectedWallet,
    ledgerWallet,
    metaMaskWallet,
    omniWallet,
    rainbowWallet,
    trustWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import './index.scss';

import { ParticleNetwork } from '@particle-network/auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';
import '@rainbow-me/rainbowkit/styles.css';
import { useMemo } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const PageRainbowKit = () => {
    const particle = useMemo(() => {
        return new ParticleNetwork({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chainName: 'Ethereum',
            chainId: 1,
            wallet: {
                displayWalletEntry: true,
            },
        });
    }, []);

    const { chains, publicClient, webSocketPublicClient } = configureChains(
        [mainnet, polygon, optimism, arbitrum],
        [publicProvider()]
    );

    const popularWallets = useMemo(() => {
        return {
            groupName: 'Popular',
            wallets: [
                particleWallet({ chains, authType: 'google' }),
                particleWallet({ chains, authType: 'facebook' }),
                particleWallet({ chains, authType: 'apple' }),
                particleWallet({ chains }),
                injectedWallet({ chains }),
                rainbowWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                coinbaseWallet({ appName: 'RainbowKit demo', chains }),
                metaMaskWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                walletConnectWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
            ],
        };
    }, [particle]);

    const connectors = connectorsForWallets([
        popularWallets,
        {
            groupName: 'Other',
            wallets: [
                argentWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                trustWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                omniWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                imTokenWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
                ledgerWallet({ chains, projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string }),
            ],
        },
    ]);

    const wagmiClient = createConfig({
        autoConnect: false,
        connectors,
        publicClient,
        webSocketPublicClient,
    });

    return (
        <WagmiConfig config={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <div className="rainbowkit-box">
                    <div className="rainbowkit-connect-btn">
                        <ConnectButton />
                    </div>

                    <a
                        href="https://docs.particle.network/auth-service/sdks/web#evm-rainbowkit-integration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rainbowkit-developer-docs"
                    >
                        Developer Documentation
                    </a>
                </div>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
export default PageRainbowKit;
