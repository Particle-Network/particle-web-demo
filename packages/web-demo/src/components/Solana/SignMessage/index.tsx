import React, { useState } from 'react';
import { Button, Input, notification } from 'antd';
import { SolanaWallet } from '@particle-network/solana-wallet';

import bs58 from 'bs58';
import './index.scss';

function SignMessage(props: { solanaWallet: SolanaWallet; address: string; demoSetting: any; loginState: boolean }) {
    const defMessage = 'Hello Particle Network!💰💰💰  \n\nhttps://particle.network';
    const [loading, setLoading] = useState(0);
    const [message, setMessage] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const { solanaWallet, address: account } = props;

    const signMessage = async () => {
        setLoading(1);
        try {
            const result = await solanaWallet.signMessage(Buffer.from(message || defMessage));
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
                        placeholder={defMessage}
                        className="result-box"
                        style={{ backgroundColor: '#fff' }}
                    ></Input.TextArea>
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
