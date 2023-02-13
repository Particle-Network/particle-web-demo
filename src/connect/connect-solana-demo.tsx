import { notification } from 'antd';
import { useAccount, useParticleProvider } from '@particle-network/connect-react-ui';
import bs58 from 'bs58';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useMemo } from 'react';

const ConnectSolanaDemo = () => {
    const provider = useParticleProvider();
    const account = useAccount();

    const connection = useMemo(() => {
        return new Connection('https://rpc.particle.network/solana?chainId=101', {
            httpHeaders: {
                Authorization: window.particle.auth.basicCredentials(),
            },
        });
    }, []);

    const signAndSendTransaction = async () => {
        try {
            const tx = new Transaction();
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(account),
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = new PublicKey(account);
            if ('sendTransaction' in provider) {
                const result = await provider.sendTransaction(tx);
                notification.success({
                    message: 'Send Success',
                    description: result,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Send Error',
                description: error.message,
            });
        }
    };
    const signTransaction = async () => {
        try {
            const tx = new Transaction();
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(account),
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = new PublicKey(account);
            if ('signTransaction' in provider) {
                const result = await provider.signTransaction(tx);
                notification.success({
                    message: 'Sign Success',
                    description: bs58.encode(result.signature),
                });
            }
        } catch (error) {
            notification.error({
                message: 'Send Error',
                description: error.message,
            });
        }
    };

    const signAllTransactions = async () => {
        try {
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            const tx1 = new Transaction();
            tx1.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(account),
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            tx1.recentBlockhash = blockhash;
            tx1.lastValidBlockHeight = lastValidBlockHeight;
            tx1.feePayer = new PublicKey(account);
            const tx2 = new Transaction();
            tx2.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(account),
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            tx2.recentBlockhash = blockhash;
            tx2.lastValidBlockHeight = lastValidBlockHeight;
            tx2.feePayer = new PublicKey(account);
            if ('signAllTransactions' in provider) {
                await provider.signAllTransactions([tx1, tx2]);
                notification.success({
                    message: 'Success',
                    description: 'Sign All Transactions ',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Sign All Transactions Error',
                description: error.message,
            });
        }
    };
    const signMessage = async () => {
        try {
            if ('signMessage' in provider) {
                const result = await provider.signMessage(Buffer.from('Hello Particle Network!💰💰💰'));
                notification.success({
                    message: 'Sign Message Success',
                    description: bs58.encode(result),
                });
            }
        } catch (error) {
            notification.error({
                message: 'Sign Message Error',
                description: error.message,
            });
        }
    };
    return (
        <div style={{ marginTop: '100px' }}>
            <div className="body-content">
                <div className="card-zero">
                    <div className="title">Basic Actions</div>
                    <div>
                        <div className="content">Account: {account}</div>
                    </div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Transaction</div>
                    <div>
                        <button className="blue-btn" onClick={signAndSendTransaction}>
                            Sign And Send Transaction
                        </button>
                        <button className="blue-btn mgt" onClick={signTransaction}>
                            Sign Transaction
                        </button>
                        <button className="blue-btn mgt" onClick={signAllTransactions}>
                            Sign All Transactions
                        </button>
                    </div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Message</div>
                    <div>
                        <button className="blue-btn" onClick={signMessage}>
                            Sign Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectSolanaDemo;
