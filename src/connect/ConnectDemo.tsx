import { ModalProvider, ConnectButton, useAccount } from "@particle-network/connect-react-ui";
import { evmWallets } from "@particle-network/connect";
import "./ConnectDemo.css";
import EvmDemo from "./connect-evm-demo";

export default function ConnectDemo() {
  return (
    <ModalProvider
      options={{
        projectId: "34c6b829-5b89-44e8-90a9-6d982787b9c9",
        clientKey: "c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR",
        appId: "64f36641-b68c-4b19-aa10-5c5304d0eab3",
        chain: {
          name: "Ethereum",
          id: 1,
        },
        wallets: evmWallets({ qrcode: false }),
      }}
    >
      <ConnectContent></ConnectContent>
    </ModalProvider>
  );
}

function ConnectContent() {
  const account = useAccount();
  return (
    <div>
      <div className="bt-connect">
        <ConnectButton></ConnectButton>
      </div>
      {account && <EvmDemo></EvmDemo>}
    </div>
  );
}
