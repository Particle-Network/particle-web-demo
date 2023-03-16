import React, { useEffect, useState } from 'react';
import { Button, Input, notification } from 'antd';
import { toChecksumAddress } from '@ethereumjs/util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import './index.scss';
import { toBase58Address } from '@particle-network/auth';
function PersonalSign(props: any) {
    const [loading, setLoading] = useState(0);
    const [result, setResult] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const [message, setMessage] = useState('');

    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return chainKey.includes('Tron');
    };

    const isEvm = () => {
        return !chainKey.includes('Solana');
    };

    useEffect(() => {
        const isPersonalSign = window.localStorage.getItem('isPersonalSign');
        if (props?.loginState && isEvm() && isPersonalSign !== '1') {
            window.localStorage.setItem('isPersonalSign', '1');
            personalSign();
        }
    }, [props.loginState]);

    const personalSignMessage =
        'Hello Particle Network!💰💰💰 \n\nThe fastest path from ideas to deployment in a single workflow for high performance dApps. \n\nhttps://particle.network';

    const personalSign = async () => {
        setLoading(1);
        // Personal Sign
        const accounts = await window.web3.eth.getAccounts();
        if (message && message.trim() === '') {
            setLoading(0);
            return notification.error({
                message: 'please enter a message',
            });
        }

        window.web3.eth.personal
            .sign(message || personalSignMessage, accounts[0])
            .then((result) => {
                console.log('personal_sign', result);
                setResult(result);
            })
            .catch((error) => {
                console.error('personal_sign', error);
                setLoading(0);
            });
    };

    useEffect(() => {
        setResult('');
        setRecoveryResult('');
    }, [chainKey]);

    useEffect(() => {
        if (result) {
            personalSignRecovery();
        } else {
            setRecoveryResult('');
        }
    }, [result]);

    const personalSignRecovery = async () => {
        if (!result) {
            return;
        }

        const data = recoverPersonalSignature({
            data: message || personalSignMessage,
            signature: result,
        });
        if (isTron()) {
            setRecoveryResult(toBase58Address(data));
        } else {
            setRecoveryResult(toChecksumAddress(data));
        }

        setLoading(0);
    };
    return (
        <div className="form-item card">
            <h3>
                Personal Sign
                <Button loading={!!loading} type="primary" onClick={personalSign} disabled={!props.loginState}>
                    SIGN
                </Button>
            </h3>
            <div className="form-input">
                <label
                    style={{
                        maxWidth: '100%',
                    }}
                >
                    <p>Message</p>
                    <Input.TextArea
                        // @ts-ignore
                        onInput={(e) => setMessage(e.target.value)}
                        placeholder={personalSignMessage}
                        className="result-box"
                        style={{ backgroundColor: '#fff' }}
                    ></Input.TextArea>
                </label>
            </div>
            {result && (
                <div className="form-input">
                    <label>
                        <p>Result</p>
                        <div className="result-box">{result}</div>
                    </label>
                    <label>
                        <p>Recovery result</p>
                        <div className="result-box">{recoveryResult}</div>
                    </label>
                </div>
            )}
        </div>
    );
}

export default PersonalSign;
