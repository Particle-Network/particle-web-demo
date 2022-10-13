import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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
} from "@rainbow-me/rainbowkit/wallets";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { particleWallet } from "@particle-network/rainbowkit-ext";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC" }), publicProvider()]
);

const popularWallets = {
  groupName: "Popular",
  wallets: [
    particleWallet({ chains, authType: "google" }),
    particleWallet({ chains, authType: "facebook" }),
    particleWallet({ chains, authType: "apple" }),
    particleWallet({ chains }),
    injectedWallet({ chains }),
    rainbowWallet({ chains }),
    coinbaseWallet({ appName: "RainbowKit demo", chains }),
    metaMaskWallet({ chains }),
    walletConnectWallet({ chains }),
  ],
};

const connectors = connectorsForWallets([
  popularWallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      omniWallet({ chains }),
      imTokenWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function RainbowKitDemo() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div style={{ display: "flex", justifyContent: "right", marginTop: "30px", marginRight: "50px" }}>
          <ConnectButton />
        </div>
        <a
          style={{ display: "flex", justifyContent: "center", fontSize: "30px", fontWeight: "bold" }}
          href="https://docs.particle.network/auth-service/sdks/web#evm-rainbowkit-integration"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developer Documentation
        </a>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
