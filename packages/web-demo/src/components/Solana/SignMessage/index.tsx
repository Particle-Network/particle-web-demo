import { SolanaWallet } from '@particle-network/solana-wallet';
import { Button, Input, notification, Select } from 'antd';
import bs58 from 'bs58';
import { useState } from 'react';
import { personalSignMessage } from '../../../utils/config';
import './index.scss';

function SignMessage(props: { solanaWallet: SolanaWallet; address: string; demoSetting: any; loginState: boolean }) {
    const [loading, setLoading] = useState(0);
    const [message, setMessage] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const { solanaWallet, address: account } = props;
    const [messageType, setMessageType] = useState('string');

    const signMessage = async () => {
        setLoading(1);
        try {
            let result: any = void 0;
            if (messageType === 'string') {
                result = await solanaWallet.signMessage(Buffer.from(message || personalSignMessage));
            } else if (messageType === 'base64') {
                const uint8Array = Buffer.from(message || personalSignMessage, 'base64');
                result = await solanaWallet.signMessage(uint8Array);
            } else if (messageType === 'base58') {
                result = await solanaWallet.signMessage(bs58.decode(message || personalSignMessage));
            }
            setRecoveryResult(bs58.encode(result));
            notification.success({
                message: 'Sign Message Success',
                description: bs58.encode(result),
            });
            setLoading(0);
        } catch (error: any) {
            notification.error({
                message: 'Sign Message Error',
                description: error.message,
            });
            setLoading(0);
        }
    };
    return (
        <div className="form-item card sign-solana">
            <h3>
                Sign Message
                <Button loading={!!loading} type="primary" onClick={signMessage} disabled={!props.loginState}>
                    SIGN
                </Button>
            </h3>
            <div className="form-input">
                <label>
                    <p>Message</p>
                    <Input.TextArea
                        // @ts-ignore
                        onInput={(e) => setMessage(e.target.value)}
                        placeholder={personalSignMessage}
                        className="result-box"
                        style={{ backgroundColor: '#fff' }}
                    ></Input.TextArea>
                </label>
                <label>
                    <p>Type</p>
                    <Select
                        style={{ width: '100%', marginTop: 5 }}
                        defaultValue={'string'}
                        value={messageType}
                        onChange={setMessageType}
                    >
                        <Select.Option value="string">Text</Select.Option>
                        <Select.Option value="base64">Base64</Select.Option>
                        <Select.Option value="base58">Base58</Select.Option>
                    </Select>
                </label>

                {recoveryResult && (
                    <label>
                        <p>Result</p>
                        <div className="result-box">{recoveryResult}</div>
                    </label>
                )}
            </div>
        </div>
    );
}

export default SignMessage;
