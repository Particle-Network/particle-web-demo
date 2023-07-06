import { toChecksumAddress } from '@ethereumjs/util';
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util';
import { toBase58Address } from '@particle-network/auth';
import { Button, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { isJson } from '../../../utils';

function SignTypedDatav1(props: any) {
    const [loading, setLoading] = useState(0);
    const [result, setResult] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const [msg, setMsg] = useState('');

    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return chainKey.includes('Tron');
    };

    useEffect(() => {
        setResult('');
        setRecoveryResult('');
    }, [chainKey]);

    const msgV1 = [
        {
            type: 'string',
            name: 'fullName',
            value: 'John Doe',
        },
        {
            type: 'uint32',
            name: 'userId',
            value: '1234',
        },
    ];
    const signTypedDataV1 = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];

        try {
            if (msg && !isJson(msg)) {
                setLoading(0);
                return notification.error({
                    // @ts-ignore
                    message: 'Failed to verify json',
                });
            }

            const params = [msg || JSON.stringify(msgV1), from];
            const method = 'eth_signTypedData_v1';
            (window.web3.currentProvider as any)
                .request({
                    method,
                    params,
                })
                .then((result) => {
                    console.log('signTypedData result', result);
                    setResult(result);
                })
                .catch((err) => {
                    console.log('signTypedData error', err);
                    setLoading(0);
                });
        } catch (error) {
            notification.error({
                // @ts-ignore
                message: error?.message,
            });
        }
    };

    const signTypedDataV1Recovery = () => {
        if (!result) {
            return;
        }

        const data = recoverTypedSignature({
            data: msgV1,
            signature: result,
            version: SignTypedDataVersion.V1,
        });
        if (isTron()) {
            setRecoveryResult(toBase58Address(data));
        } else {
            setRecoveryResult(toChecksumAddress(data));
        }
    };

    useEffect(() => {
        if (result) {
            signTypedDataV1Recovery();
        } else {
            setRecoveryResult('');
        }
    }, [result]);

    return (
        <div className="form-item card">
            <h3>Sign Typed Data v1</h3>
            <div className="form-input">
                <label
                    style={{
                        maxWidth: '100%',
                    }}
                >
                    <p>Message</p>
                    <Input.TextArea
                        // @ts-ignore
                        onInput={(e) => setMsg(e.target.value)}
                        placeholder={JSON.stringify(msgV1)}
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
                <Button loading={!!loading} type="primary" onClick={signTypedDataV1} disabled={!props.loginState}>
                    SIGN
                </Button>
            </div>
        </div>
    );
}

export default SignTypedDatav1;
