import { toChecksumAddress } from '@ethereumjs/util';
import { SignTypedDataVersion, recoverTypedSignature } from '@metamask/eth-sig-util';
import { toBase58Address } from '@particle-network/auth';
import { Button, Checkbox, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { isJson } from '../../../utils';
function SignTypedDatav4(props: any) {
    const [loading, setLoading] = useState(0);
    const [result, setResult] = useState('');
    const [recoveryResult, setRecoveryResult] = useState('');
    const [msg, setMsg] = useState('');
    const [unique, setUnique] = useState(false);

    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return chainKey.includes('Tron');
    };

    const signTypedDataV4 = async () => {
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
            const params = [from, msg || JSON.stringify(payloadV4)];
            const method = unique ? 'eth_signTypedData_v4_uniq' : 'eth_signTypedData_v4';

            //EIP712Domain and domain order: name, version, chainId, verifyingContract

            (window.web3.currentProvider as any)
                .request({
                    method,
                    params,
                })
                .then((result) => {
                    console.log('signTypedData_v4 result', result);
                    setResult(result);
                    setLoading(0);
                })
                .catch((err) => {
                    console.log('signTypedData_v4 error', err);
                    setLoading(0);
                });
        } catch (error) {
            notification.error({
                // @ts-ignore
                message: error?.message,
            });
        }
    };

    const signTypedDataV4Recovery = () => {
        if (!result) {
            return;
        }

        const data = recoverTypedSignature({
            data: payloadV4 as any,
            signature: result,
            version: SignTypedDataVersion.V4,
        });
        if (isTron()) {
            setRecoveryResult(toBase58Address(data));
        } else {
            setRecoveryResult(toChecksumAddress(data));
        }
    };

    useEffect(() => {
        setResult('');
        setRecoveryResult('');
    }, [chainKey]);

    useEffect(() => {
        if (result) {
            signTypedDataV4Recovery();
        } else {
            setRecoveryResult('');
        }
    }, [result]);

    return (
        <div className="form-item card">
            <h3>
                Sign Typed Data v4
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
                        onInput={(e) => setMsg(e.target.value)}
                        placeholder={JSON.stringify(payloadV4)}
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
                <Button loading={!!loading} type="primary" onClick={signTypedDataV4} disabled={!props.loginState}>
                    SIGN
                </Button>
            </div>
        </div>
    );
}
export const payloadV4 = {
    types: {
        EIP712Domain: [
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'version',
                type: 'string',
            },
            {
                name: 'chainId',
                type: 'uint256',
            },
            {
                name: 'verifyingContract',
                type: 'address',
            },
        ],
        Order: [
            {
                name: 'exchange',
                type: 'address',
            },
            {
                name: 'maker',
                type: 'address',
            },
            {
                name: 'taker',
                type: 'address',
            },
            {
                name: 'makerRelayerFee',
                type: 'uint256',
            },
            {
                name: 'takerRelayerFee',
                type: 'uint256',
            },
            {
                name: 'makerProtocolFee',
                type: 'uint256',
            },
            {
                name: 'takerProtocolFee',
                type: 'uint256',
            },
            {
                name: 'feeRecipient',
                type: 'address',
            },
            {
                name: 'feeMethod',
                type: 'uint8',
            },
            {
                name: 'side',
                type: 'uint8',
            },
            {
                name: 'saleKind',
                type: 'uint8',
            },
            {
                name: 'target',
                type: 'address',
            },
            {
                name: 'howToCall',
                type: 'uint8',
            },
            {
                name: 'calldata',
                type: 'bytes',
            },
            {
                name: 'replacementPattern',
                type: 'bytes',
            },
            {
                name: 'staticTarget',
                type: 'address',
            },
            {
                name: 'staticExtradata',
                type: 'bytes',
            },
            {
                name: 'paymentToken',
                type: 'address',
            },
            {
                name: 'basePrice',
                type: 'uint256',
            },
            {
                name: 'extra',
                type: 'uint256',
            },
            {
                name: 'listingTime',
                type: 'uint256',
            },
            {
                name: 'expirationTime',
                type: 'uint256',
            },
            {
                name: 'salt',
                type: 'uint256',
            },
            {
                name: 'nonce',
                type: 'uint256',
            },
        ],
    },
    primaryType: 'Order',
    domain: {
        name: 'LifeForm Exchange Contract',
        version: '2.3',
        chainId: '97',
        verifyingContract: '0x9407Ec32b440aEcbDbC1Ff93324Af5FE626D4dd3',
    },
    message: {
        exchange: '0x9407Ec32b440aEcbDbC1Ff93324Af5FE626D4dd3',
        maker: '0x2CeD4F9bBfcD178F7Cf0F949249cd1C3b649bDb7',
        taker: '0x0000000000000000000000000000000000000000',
        makerRelayerFee: 50,
        takerRelayerFee: 0,
        makerProtocolFee: 0,
        takerProtocolFee: 0,
        feeMethod: 1,
        side: 1,
        saleKind: 0,
        target: '0xC4f609c43448b462a042e5E5E9E2100D070A0E04',
        howToCall: 0,
        calldata:
            '0xf242432a0000000000000000000000002ced4f9bbfcd178f7cf0f949249cd1c3b649bdb70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025b378602000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        replacementPattern:
            '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        staticTarget: '0x0000000000000000000000000000000000000000',
        staticExtradata: '0x',
        paymentToken: '0x4f500465c89c2f8A44D1142e02338534C0c421be',
        basePrice: '1000000000000000000',
        extra: 0,
        listingTime: 1666347130,
        expirationTime: 1666606330,
        salt: '1666347130000',
        feeRecipient: '0xfE517e9d1E74787660a3202D3916367c6e363f2e',
        nonce: '0',
    },
};

export default SignTypedDatav4;
