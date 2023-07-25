import React, { useMemo, useState } from 'react';
import { Button, message, Input, InputNumber, notification } from 'antd';
import { ParticleChains, chains } from '@particle-network/chains';
import { toBase58Address, toHexAddress } from '@particle-network/auth';
import { isValidEVMAddress, isValidTronAddress } from '../../../utils';
function SendETH(props: any) {
    const [loading, setLoading] = useState<number>(0);
    const defEthAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [ethAmount, setEthAmount] = useState<string>('');
    const { demoSetting } = props;
    const { chainKey } = demoSetting;

    const isTron = () => {
        return ParticleChains[chainKey].name === 'Tron';
    };

    const defReceiveAddress = useMemo(() => {
        return isTron()
            ? toBase58Address('0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e')
            : '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    }, [chainKey]);

    const isSupportEIP1559 = () => {
        return chains.isChainSupportEIP1559(ParticleChains[chainKey])
    };
    const sendTransaction = async () => {
        setLoading(1);
        const address = receiveAddress || defReceiveAddress;
        const amount = ethAmount || defEthAmount;
        const amountWei = window.web3.utils.toWei(amount, isTron() ? 'mwei' : 'ether');

        const accounts = await window.web3.eth.getAccounts();

        try {
            if (isTron()) {
                if (!isValidTronAddress(address)) {
                    setLoading(0);
                    return notification.error({
                        message: 'Please enter the correct address',
                    });
                }
                const txnParams = {
                    from: accounts[0],
                    to: toHexAddress(address),
                    value: amountWei,
                };
                window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                    console.log('sendTransaction', error, hash);
                    setLoading(0);
                    if (error) {
                        if (error.code !== 4011) {
                            message.error(error.message);
                        }
                    } else {
                        notification.success({
                            message: 'Send Success',
                            description: hash,
                        });
                    }
                });
            } else {
                if (!isValidEVMAddress(address)) {
                    setLoading(0);
                    return notification.error({
                        message: 'Please enter the correct address',
                    });
                }

                const txnParams = {
                    from: accounts[0],
                    to: address,
                    value: amountWei,
                    type: '0x0',
                    gasLimit: 21000,
                };

                window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                    console.log('sendTransaction', error, hash);
                    setLoading(0);

                    if (error) {
                        if (error.code !== 4011) {
                            message.error(error.message);
                        }
                    } else {
                        notification.success({
                            message: 'Send Success',
                            description: hash,
                        });
                    }
                });
            }
        } catch (error) {
            setLoading(0);
        }
    };

    const sendEIP1559Transaction = async () => {
        setLoading(2);
        const address = receiveAddress || defReceiveAddress;
        if (!isValidEVMAddress(address)) {
            setLoading(0);
            return notification.error({
                message: 'Please enter the correct address',
            });
        }
        const amount = ethAmount || defEthAmount;
        const accounts = await window.web3.eth.getAccounts();
        const amountWei = window.web3.utils.toWei(amount, 'ether');

        if (!isValidEVMAddress(address)) {
            setLoading(0);
            return notification.error({
                message: 'Please enter the correct address',
            });
        }
        const txnParams = {
            from: accounts[0],
            to: address,
            value: amountWei,
            type: '0x2',
            gasLimit: 21000,
        };
        window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
            if (error) {
                if (error.code !== 4011) {
                    message.error(error.message);
                }
            } else {
                notification.success({
                    message: 'Send Success',
                    description: hash,
                });
            }
            setLoading(0);
        });
    };
    return (
        <div className="form-item card">
            <h3>Send {ParticleChains?.[chainKey]?.nativeCurrency.symbol}</h3>
            <div className="form-input">
                <label>
                    <p>Receive address</p>
                    <Input
                        placeholder={defReceiveAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setReceiveAddress(e.target?.value)}
                    ></Input>
                </label>
                <label>
                    <p>Token amount</p>
                    <InputNumber
                        min={0}
                        max={10000}
                        placeholder={defEthAmount}
                        precision={5}
                        readOnly={!!loading}
                        onChange={(e: any) => setEthAmount(e?.toString())}
                    ></InputNumber>
                </label>
            </div>

            <div className="form-submit">
                <Button type="primary" loading={loading === 1} onClick={sendTransaction} disabled={!props.loginState}>
                    SEND TRANSACTION
                </Button>

                {isSupportEIP1559() && (
                    <Button
                        type="primary"
                        loading={loading === 2}
                        onClick={sendEIP1559Transaction}
                        disabled={!props.loginState}
                    >
                        SEND EIP1559 TRANSACTION
                    </Button>
                )}
            </div>
        </div>
    );
}

export default SendETH;
