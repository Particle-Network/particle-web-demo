import { SafetyOutlined } from '@ant-design/icons';
import Erc4337GasModal from '../erc4337GasModal';
import ContractCall from './ContractCall';
import PersonalSign from './PersonalSign';
import SendERC1155Tokens from './SendERC1155Tokens';
import SendERC20Approve from './SendERC20Approve';
import SendERC20Tokens from './SendERC20Tokens';
import ERC4337SendERC20Tokens from './SendERC20Tokens/erc4337';
import SendERC721Tokens from './SendERC721Tokens';
import SendETH from './SendETH';
import ERC4337SendETH from './SendETH/erc4337';
import SignTypedDatav1 from './SignTypedDatav1';
import SignTypedDatav3 from './SignTypedDatav3';
import SignTypedDatav4 from './SignTypedDatav4';

const EVM = (props: any) => {
    const { demoSetting, loginState, isTron } = props;
    return (
        <>
            <h2 className="line-title">
                <SafetyOutlined /> &nbsp; Transaction
            </h2>
            <div className="transaction ">
                {demoSetting.erc4337 ? (
                    <>
                        <ERC4337SendETH loginState={loginState} />
                        <ERC4337SendERC20Tokens loginState={loginState} />
                    </>
                ) : (
                    <>
                        <SendETH demoSetting={demoSetting} loginState={loginState} />
                        {!isTron && (
                            <>
                                <SendERC20Approve demoSetting={demoSetting} loginState={loginState} />
                                <SendERC20Tokens demoSetting={demoSetting} loginState={loginState} />
                                <SendERC721Tokens demoSetting={demoSetting} loginState={loginState} />
                                <SendERC1155Tokens demoSetting={demoSetting} loginState={loginState} />
                                <ContractCall demoSetting={demoSetting} loginState={loginState}></ContractCall>
                            </>
                        )}
                    </>
                )}
            </div>

            {!demoSetting.erc4337 && (
                <>
                    <h2 className="line-title">
                        <SafetyOutlined /> &nbsp; Signature
                    </h2>
                    <div className="transaction">
                        <PersonalSign demoSetting={demoSetting} loginState={loginState} />
                        <SignTypedDatav1 demoSetting={demoSetting} loginState={loginState} />
                        <SignTypedDatav3 demoSetting={demoSetting} loginState={loginState} />
                        <SignTypedDatav4 demoSetting={demoSetting} loginState={loginState} />
                    </div>
                </>
            )}
            <Erc4337GasModal></Erc4337GasModal>
        </>
    );
};

export default EVM;
