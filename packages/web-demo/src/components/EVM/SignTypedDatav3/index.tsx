import { toChecksumAddress } from '@ethereumjs/util';
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util';
import { toBase58Address } from '@particle-network/auth';
import { Button, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { isJson } from '../../../utils';

function SignTypedDatav3(props: any) {
    const [loading, setLoading] = useState(0);
    const [result, setResult] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const [msg, setMsg] = useState('');

    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return chainKey.includes('Tron');
    };

    const payloadV3 = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
            ],
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' },
            ],
        },
        primaryType: 'Mail',
        domain: {
            name: 'Ether Mail',
            version: '1',
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'Hello, Bob!',
        },
    };

    const signTypedDataV3 = async () => {
        setLoading(1);
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
            const params = [from, msg || JSON.stringify(payloadV3)];
            const method = 'eth_signTypedData_v3';
            (window.web3.currentProvider as any)
                .request({
                    method,
                    params,
                })
                .then((result) => {
                    console.log('signTypedData_v3 result', result);
                    setResult(result);
                })
                .catch((err) => {
                    console.log('signTypedData_v3 error', err);
                    setLoading(0);
                });
        } catch (error) {
            notification.error({
                // @ts-ignore
                message: error?.message,
            });
        }
    };

    useEffect(() => {
        setResult('');
        setRecoveryResult('');
    }, [chainKey]);

    const signTypedDataV3Recovery = () => {
        if (!result) {
            return;
        }

        const data = recoverTypedSignature({
            data: payloadV3 as any,
            signature: result,
            version: SignTypedDataVersion.V3,
        });
        setLoading(0);
        if (isTron()) {
            setRecoveryResult(toBase58Address(data));
        } else {
            setRecoveryResult(toChecksumAddress(data));
        }
    };

    useEffect(() => {
        if (result) {
            signTypedDataV3Recovery();
        } else {
            setRecoveryResult('');
        }
    }, [result]);

    return (
        <div className="form-item card">
            <h3>Sign Typed Data v3</h3>
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
                        placeholder={JSON.stringify(payloadV3)}
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
                <Button loading={!!loading} type="primary" onClick={signTypedDataV3} disabled={!props.loginState}>
                    SIGN
                </Button>
            </div>
        </div>
    );
}

export default SignTypedDatav3;
