import { ModalProvider, ConnectButton, useAccount } from "@particle-network/connect-react-ui";
import { evmWallets } from "@particle-network/connect";
import "./ConnectDemo.css";
import EvmDemo from "./connect-evm-demo";

export default function ConnectDemo() {
    return (
        <ModalProvider
            options={{
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
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
