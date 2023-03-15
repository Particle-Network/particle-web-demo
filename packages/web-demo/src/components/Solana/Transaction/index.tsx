import React, { useState } from 'react';
import { Button, notification, Input, InputNumber } from 'antd';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaWallet } from '@particle-network/solana-wallet';
import { isValidSolanaAddress } from '../../../utils';
function Transcation(props: { solanaWallet: SolanaWallet; address: string; demoSetting: any; loginState: boolean }) {
    const [loading, setLoading] = useState<number>(0);
    const defReceiveAddress: string = 'F4FGwoBDM8HZJjGWnhqnh5xwNssbcPgQKD4mEK1r7rjo';
    const defAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    // const { demoSetting } = props;
    const { solanaWallet, address: account } = props;
    const connection = solanaWallet?.getConnection();

    const signAndSendTransaction = async () => {
        setLoading(1);
        try {
            const tx = new Transaction();
            const toAddress = receiveAddress || defReceiveAddress;
            if (!isValidSolanaAddress(toAddress)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct Public key',
                });
            }

            tx.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(account),
                    toPubkey: new PublicKey(toAddress),
                    lamports: Number(amount || defAmount) * 1000000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = new PublicKey(account);
            const result = await solanaWallet.signAndSendTransaction(tx);
            notification.success({
                message: 'Send Success',
                description: result,
            });
            setLoading(0);
        } catch (error: any) {
            notification.error({
                message: 'Send Error',
                description: error?.message || '',
            });
        }
        setLoading(0);
    };

    return (
        <div className="form-item card">
            <h3>Sign And Send Transcation </h3>
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
                        precision={5}
                        placeholder={defAmount}
                        readOnly={!!loading}
                        onChange={(e) => setAmount(e?.toString() || '')}
                    ></InputNumber>
                </label>
            </div>

            <div className="form-submit">
                <Button
                    type="primary"
                    loading={loading === 1}
                    onClick={signAndSendTransaction}
                    disabled={!props.loginState}
                >
                    SEND
                </Button>
            </div>
        </div>
    );
}

export default Transcation;
