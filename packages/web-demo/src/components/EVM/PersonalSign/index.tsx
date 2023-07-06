import { toChecksumAddress } from '@ethereumjs/util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { toBase58Address } from '@particle-network/auth';
import { Button, Checkbox, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { personalSignMessage } from '../../../utils/config';
import './index.scss';

function PersonalSign(props: any) {
    const [loading, setLoading] = useState(0);
    const [result, setResult] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const [message, setMessage] = useState('');
    const [unique, setUnique] = useState(false);

    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return chainKey.includes('Tron');
    };

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

        let signPromise;
        if (unique) {
            signPromise = (window.web3.currentProvider as any).request({
                method: 'personal_sign_uniq',
                params: [message || personalSignMessage, accounts[0]],
            });
        } else {
            signPromise = window.web3.eth.personal.sign(message || personalSignMessage, accounts[0], '');
        }
        signPromise
            .then((result) => {
                console.log('personal_sign', result);
                setResult(result);
                setLoading(0);
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
    };

    return (
        <div className="form-item card">
            <h3>
                Personal Sign
                <Checkbox onChange={(t) => setUnique(t.target.checked)}>Unique</Checkbox>
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

            <div className="form-submit">
                <Button loading={!!loading} type="primary" onClick={personalSign} disabled={!props.loginState}>
                    SIGN
                </Button>
            </div>
        </div>
    );
}

export default PersonalSign;
