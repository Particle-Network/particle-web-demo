import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

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

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import React, { useMemo } from 'react';
import { ParticleNetwork } from '@particle-network/auth';

import { particleWallet } from '@particle-network/rainbowkit-ext';

new ParticleNetwork({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
    appId: process.env.NEXT_PUBLIC_APP_ID as string,
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()]
);

const particleWallets =
    typeof window !== 'undefined'
        ? [
              particleWallet({ chains, authType: 'google' }),
              particleWallet({ chains, authType: 'facebook' }),
              particleWallet({ chains, authType: 'apple' }),
              particleWallet({ chains }),
          ]
        : [];

const popularWallets = {
    groupName: 'Popular',
    wallets: [
        ...particleWallets,
        injectedWallet({ chains }),
        rainbowWallet({ chains }),
        coinbaseWallet({ appName: 'RainbowKit demo', chains }),
        metaMaskWallet({ chains }),
        walletConnectWallet({ chains }),
    ],
};

const connectors = connectorsForWallets([
    popularWallets,
    {
        groupName: 'Other',
        wallets: [
            argentWallet({ chains }),
            trustWallet({ chains }),
            omniWallet({ chains }),
            imTokenWallet({ chains }),
            ledgerWallet({ chains }),
        ],
    },
]);

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

function WagmiProvider(props: any) {
    return (
        <>
            {config && (
                <WagmiConfig config={config}>
                    <RainbowKitProvider chains={chains}>{props.children}</RainbowKitProvider>
                </WagmiConfig>
            )}
        </>
    );
}

export default WagmiProvider;
