import React, { useState } from 'react';
import { Button, Input, InputNumber, notification } from 'antd';
import { SolanaWallet } from '@particle-network/solana-wallet';
import bs58 from 'bs58';
import './index.scss';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { isValidSolanaAddress } from '../../../utils';

function SignTransaction(props: {
    solanaWallet: SolanaWallet;
    address: string;
    demoSetting: any;
    loginState: boolean;
}) {
    const defMessage = 'F4FGwoBDM8HZJjGWnhqnh5xwNssbcPgQKD4mEK1r7rjo';
    const defAmount = '0.001';
    const [loading, setLoading] = useState(0);
    const [message, setMessage] = useState('');
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState('');
    const { solanaWallet, address: account } = props;

    const signTransaction = async () => {
        setLoading(1);
        try {
            const tx = new Transaction();
            const toAddress = message || defMessage;
            if (!isValidSolanaAddress(toAddress)) {
                setLoading(0);
                return notification.error({
                    message: 'Please enter the correct Public key',
                });
            }
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: solanaWallet.publicKey!,
                    toPubkey: new PublicKey(toAddress),
                    lamports: amount ? Number(amount) * 1000000000 : Number(defAmount) * 1000000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await solanaWallet.getConnection().getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = solanaWallet.publicKey!;
            const result = await solanaWallet.signTransaction(tx);
            setResult(bs58.encode(result.signature));
            setLoading(0);
        } catch (error: any) {
            notification.error({
                message: 'Send Error',
                description: error.message,
            });
            setLoading(0);
        }
    };
    return (
        <div className="form-item card sign-tran">
            <h3>
                Sign Transaction
                <Button loading={!!loading} type="primary" onClick={signTransaction} disabled={!props.loginState}>
                    SIGN
                </Button>
            </h3>
            <div className="form-input">
                <label>
                    <div style={{ marginBottom: 25 }}>
                        <p>Receive address</p>
                        <Input
                            // @ts-ignore
                            onInput={(e) => setMessage(e.target.value)}
                            placeholder={defMessage}
                            style={{ backgroundColor: '#fff' }}
                        ></Input>
                    </div>
                </label>

                <label>
                    <div>
                        <p>Amount</p>
                        <InputNumber
                            min={0}
                            max={10000}
                            precision={5}
                            onChange={(e) => setAmount(e?.toString() || '')}
                            placeholder={defAmount}
                            style={{ backgroundColor: '#fff' }}
                        ></InputNumber>
                    </div>
                </label>
                {result && (
                    <label>
                        <p>Result</p>
                        <div className="result-box">{result}</div>
                    </label>
                )}
            </div>
        </div>
    );
}

export default SignTransaction;
