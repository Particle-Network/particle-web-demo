import {
  ModalProvider,
  ConnectButton,
  useAccount,
  evmWallets,
  useParticleProvider,
} from "@particle-network/connect-react-ui";
import "./ConnectDemo.css";
import EvmDemo from "./connect-evm-demo";
import "@particle-network/connect-react-ui/dist/index.css";
import { isEVMProvider, solanaWallets } from "@particle-network/connect";
import ConnectSolanaDemo from "./connect-solana-demo";

export default function ConnectDemo() {
  return (
    <ModalProvider
      options={{
        projectId: "34c6b829-5b89-44e8-90a9-6d982787b9c9",
        clientKey: "c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR",
        appId: "64f36641-b68c-4b19-aa10-5c5304d0eab3",
        chains: [
          {
            name: "Ethereum",
            id: 1,
          },
          {
            name: "Ethereum",
            id: 5,
          },
          {
            name: "Solana",
            id: 101,
          },
        ],
        wallets: [...evmWallets({ qrcode: false }), ...solanaWallets()],
      }}
      theme={(localStorage.getItem("dapp_particle_theme") ?? "light") as "light" | "auto" | "dark"}
    >
      <ConnectContent></ConnectContent>
    </ModalProvider>
  );
}

function ConnectContent() {
  const account = useAccount();
  const provider = useParticleProvider();
  return (
    <div>
      <div className="bt-connect">
        <ConnectButton></ConnectButton>
      </div>
      {account && provider && (isEVMProvider(provider) ? <EvmDemo></EvmDemo> : <ConnectSolanaDemo />)}
    </div>
  );
}
