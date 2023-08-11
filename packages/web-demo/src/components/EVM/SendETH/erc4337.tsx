import { Button, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { isValidEVMAddress } from '../../../utils';
import events from '../../../utils/eventBus';

function ERC4337SendETH(props: any) {
    const [loading, setLoading] = useState<number>(0);
    const defEthAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [ethAmount, setEthAmount] = useState<string>('');

    const defReceiveAddress = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';

    const sendTransaction = async () => {
        setLoading(1);
        const address = receiveAddress || defReceiveAddress;
        const amount = ethAmount || defEthAmount;
        const amountWei = window.web3.utils.toWei(amount, 'ether');

        const accounts = await window.web3.eth.getAccounts();

        try {
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
            };

            const feeQuotesResult = await window.smartAccount.getFeeQuotes(txnParams);

            const txHash = await new Promise<string>((resolve, reject) => {
                events.removeAllListeners('erc4337:sendTransaction');
                events.removeAllListeners('erc4337:sendTransactionError');
                events.once('erc4337:sendTransaction', async (params: any) => {
                    try {
                        if (params.feeQuote) {
                            const hash = await window.smartAccount.sendTransaction({ ...params, tx: txnParams });
                            resolve(hash);
                        } else {
                            const hash = await window.smartAccount.sendTransaction(params);
                            resolve(hash);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
                events.once('erc4337:sendTransactionError', (error) => {
                    reject(error);
                });
                events.emit('erc4337:prepareTransaction', feeQuotesResult);
            });
            if (txHash) {
                notification.success({
                    message: 'Send Successfully',
                    description: txHash,
                });
            } else {
                notification.error({
                    message: 'Send Failure',
                    description: 'tx hash is null',
                });
            }
        } catch (error: any) {
            if (error.code !== 4011) {
                const msg = error.data?.extraMessage || error.message;
                if (msg) {
                    message.error(msg);
                }
            }
        } finally {
            setLoading(0);
        }
    };

    return (
        <div className="form-item card">
            <h3>Send Native Token</h3>
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
                    SEND
                </Button>
            </div>
        </div>
    );
}

export default ERC4337SendETH;
