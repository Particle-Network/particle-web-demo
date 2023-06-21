import { SafetyOutlined } from '@ant-design/icons';
import SolanaAllTransaction from './AllTransaction/index';
import SolanaSignMessage from './SignMessage/index';
import SignSolanaTransaction from './SignTransaction/index';
import SolanaTransaction from './Transaction/index';

const Solana = (porps: any) => {
    const { demoSetting, loginState, address, solanaWallet } = porps;
    return (
        <>
            <h2 className="line-title">
                <SafetyOutlined /> &nbsp; Transaction
            </h2>
            <div className="transaction">
                <SolanaTransaction
                    demoSetting={demoSetting}
                    loginState={loginState}
                    address={address}
                    solanaWallet={solanaWallet}
                ></SolanaTransaction>
                <SignSolanaTransaction
                    demoSetting={demoSetting}
                    loginState={loginState}
                    address={address}
                    solanaWallet={solanaWallet}
                />
                <SolanaAllTransaction
                    demoSetting={demoSetting}
                    loginState={loginState}
                    address={address}
                    solanaWallet={solanaWallet}
                />
                <h2 className="line-title">
                    <SafetyOutlined /> &nbsp; Signature
                </h2>
                <SolanaSignMessage
                    demoSetting={demoSetting}
                    loginState={loginState}
                    address={address}
                    solanaWallet={solanaWallet}
                />
            </div>
        </>
    );
};
export default Solana;
