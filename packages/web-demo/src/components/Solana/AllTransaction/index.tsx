import React, { useState } from 'react';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaWallet } from '@particle-network/solana-wallet';
import bs58 from 'bs58';
import { isValidSolanaAddress } from '../../../utils';

function AllTranscation(props: { solanaWallet: SolanaWallet; address: string; demoSetting: any; loginState: boolean }) {
    const [loading, setLoading] = useState<number>(0);
    const defReceiveAddress: string = 'F4FGwoBDM8HZJjGWnhqnh5xwNssbcPgQKD4mEK1r7rjo';
    const defAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [receiveAddress2, setReceiveAddress2] = useState<string>('');
    const [amount2, setAmount2] = useState<string>('');
    const [result, setResult] = useState('');
    const { solanaWallet, address: account } = props;
    const connection = solanaWallet?.getConnection();

    const signAllTransactions = async () => {
        setLoading(1);
        try {
            const toAddress1 = receiveAddress || defReceiveAddress;
            const toAddress2 = receiveAddress2 || defReceiveAddress;
            if (!isValidSolanaAddress(toAddress1)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct Public key',
                });
            }
            if (!isValidSolanaAddress(toAddress2)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct Public key2',
                });
            }

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            const txs: Transaction[] = [];
            const tx1 = new Transaction();
            tx1.add(
                SystemProgram.transfer({
                    fromPubkey: solanaWallet.publicKey!,
                    toPubkey: new PublicKey(toAddress1),
                    lamports: amount ? 1000000000 * Number(amount) : 1000000000 * Number(defAmount),
                })
            );
            txs.push(tx1);
            const tx2 = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: solanaWallet.publicKey!,
                    toPubkey: new PublicKey(toAddress2),
                    lamports: amount2 ? 1000000000 * Number(amount2) : 1000000000 * Number(defAmount),
                })
            );
            txs.push(tx2);
            txs.forEach((tx) => {
                tx.recentBlockhash = blockhash;
                tx.lastValidBlockHeight = lastValidBlockHeight;
                tx.feePayer = solanaWallet.publicKey!;
            });
            const result = await solanaWallet.signAllTransactions(txs);
            setResult(JSON.stringify(result.map((item) => bs58.encode(item.signature))));
            setLoading(0);
        } catch (error: any) {
            notification.error({
                message: error.message ?? error,
            });
            setLoading(0);
        }
    };

    return (
        <div className="form-item card">
            <h3>Sign All Transcations </h3>
            <div className="form-input">
                <label>
                    <p>Receive address 1</p>
                    <Input
                        placeholder={defReceiveAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setReceiveAddress(e.target?.value)}
                    ></Input>
                </label>
                <label>
                    <p>Token amount 1</p>
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

            <div className="form-input">
                <label>
                    <p>Receive address 2</p>
                    <Input
                        placeholder={defReceiveAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setReceiveAddress2(e.target?.value)}
                    ></Input>
                </label>
                <label>
                    <p>Token amount 2</p>
                    <InputNumber
                        min={0}
                        max={10000}
                        precision={5}
                        placeholder={defAmount}
                        readOnly={!!loading}
                        onChange={(e) => setAmount2(e?.toString() || '')}
                    ></InputNumber>
                </label>
                {result && (
                    <label>
                        <p>Result</p>
                        <div className="result-box">{result}</div>
                    </label>
                )}
            </div>

            <div className="form-submit">
                <Button
                    type="primary"
                    loading={loading === 1}
                    onClick={signAllTransactions}
                    disabled={!props.loginState}
                >
                    SIGN
                </Button>
            </div>
        </div>
    );
}

export default AllTranscation;
