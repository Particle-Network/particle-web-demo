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
        projectId: process.env.REACT_APP_PROJECT_ID as string,
        clientKey: process.env.REACT_APP_CLIENT_KEY as string,
        appId: process.env.REACT_APP_APP_ID as string,
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
