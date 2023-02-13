import { Chain } from '@particle-network/common';
import { Button, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import './App.css';
import { particle, solanaWallet } from './particle';
import bs58 from 'bs58';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

function SolanaDemo(props: any) {
    const { loginFormMode, setLoginState } = props;

    const [connect, setConnect] = useState(false);
    const [address, setAddress] = useState('');
    const [nativeBalance, setNativeBalance] = useState('0');
    const [signTransactionResult, setSignTransactionResult] = useState('');
    const [signMessageResult, setSignMessageResult] = useState('');

    useEffect(() => {
        const c = particle.auth.isLogin() && particle.auth.walletExist();
        setConnect(c);
        if (c) {
            getBalance();
        }

        particle.auth.on('chainChanged', (info: Chain) => {
            if (info.name === 'Solana') {
                getBalance();
            }
        });
    }, []);

    const nftMarketUrl = 'https://web-nft-demo.particle.network';

    const connectWallet = () => {
        particle.auth
            .login({ loginFormMode: loginFormMode })
            .then((accounts) => {
                setConnect(true);
                getBalance();
                setLoginState(true);
            })
            .catch((error: any) => {
                if (error.code !== 4011) {
                    message.error(JSON.stringify(error));
                }
            });
    };

    const getBalance = () => {
        solanaWallet
            .getConnection()
            .getBalance(solanaWallet.publicKey)
            .then((result) => {
                console.log('Solana getBalance', result);
                setNativeBalance((result / 1000000000).toFixed(4));
            });
    };

    const logout = () => {
        particle.auth
            .logout()
            .then(() => {
                console.log('logout success');
                setConnect(false);
                setNativeBalance('0');
                setLoginState(false);
            })
            .catch((err) => {
                console.log('logout error', err);
            });
    };

    const getAccounts = () => {
        if (solanaWallet.publicKey) {
            setAddress(solanaWallet.publicKey.toBase58());
        }
    };

    const openBuy = () => {
        particle.openBuy();
    };

    const signAndSendTransaction = async () => {
        try {
            const tx = new Transaction();
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: solanaWallet.publicKey,
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await solanaWallet.getConnection().getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = solanaWallet.publicKey;
            const result = await solanaWallet.signAndSendTransaction(tx);
            notification.success({
                message: 'Send Success',
                description: result,
            });
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
                    fromPubkey: solanaWallet.publicKey,
                    toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                    lamports: 10000000,
                })
            );
            const { blockhash, lastValidBlockHeight } = await solanaWallet.getConnection().getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.feePayer = solanaWallet.publicKey;
            const result = await solanaWallet.signTransaction(tx);
            setSignTransactionResult(bs58.encode(result.signature));
            notification.success({
                message: 'Sign Success',
                description: bs58.encode(result.signature),
            });
        } catch (error) {
            notification.error({
                message: 'Send Error',
                description: error.message,
            });
        }
    };
    const signAllTransactions = async () => {
        try {
            const { blockhash, lastValidBlockHeight } = await solanaWallet.getConnection().getLatestBlockhash();
            const txs = [];
            let txAmount = 30;
            while (txAmount > 0) {
                const tx = new Transaction();
                tx.add(
                    SystemProgram.transfer({
                        fromPubkey: solanaWallet.publicKey,
                        toPubkey: new PublicKey('DQnJV3hUbKo2PpqV8ugxM4nSikBGP9koNyyvoPuMvS3a'),
                        lamports: 10000000,
                    })
                );
                tx.recentBlockhash = blockhash;
                tx.lastValidBlockHeight = lastValidBlockHeight;
                tx.feePayer = solanaWallet.publicKey;
                txs.push(tx);
                txAmount--;
            }

            await solanaWallet.signAllTransactions(txs);
            message.success('Sign All Transactions Success');
        } catch (error) {
            message.error(error.message ?? error);
        }
    };
    const signMessage = async () => {
        try {
            const result = await solanaWallet.signMessage(Buffer.from('Hello Particle Network!💰💰💰'));
            setSignMessageResult(bs58.encode(result));
            notification.success({
                message: 'Sign Message Success',
                description: bs58.encode(result),
            });
        } catch (error) {
            notification.error({
                message: 'Sign Message Error',
                description: error.message,
            });
        }
    };
    return (
        <div>
            <div className="native-balance">
                Balance: {nativeBalance} SOL
                {connect && (
                    <Button style={{ marginLeft: '20px' }} type="primary" onClick={openBuy}>
                        Buy
                    </Button>
                )}
            </div>

            <div className="App-header">
                <a className="App-link" href={nftMarketUrl} target="_blank" rel="noopener noreferrer">
                    Solana NFT Market Demo
                </a>
            </div>

            <div className="body-content">
                <div className="card-zero">
                    <div className="title">Basic Actions</div>
                    <div>
                        <button className="blue-btn" onClick={connectWallet} disabled={connect}>
                            CONNECT
                        </button>
                        <button className="blue-btn mgt" onClick={logout} disabled={!connect}>
                            DISCONNECT
                        </button>
                    </div>
                    <div>
                        <button className="blue-btn" onClick={getBalance} disabled={!connect}>
                            REFRESH BALANCE
                        </button>
                        <button className="blue-btn" onClick={getAccounts} disabled={!connect}>
                            ACCOUNTS
                        </button>
                    </div>
                    <div className="content">public key: {address}</div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Transaction</div>
                    <div>
                        <button className="blue-btn" onClick={signAndSendTransaction} disabled={!connect}>
                            Sign And Send Transaction
                        </button>
                        <button className="blue-btn mgt" onClick={signTransaction} disabled={!connect}>
                            Sign Transaction
                        </button>
                        <div className="sign">Result: {signTransactionResult}</div>
                        <button className="blue-btn mgt" onClick={signAllTransactions} disabled={!connect}>
                            Sign All Transactions
                        </button>
                    </div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Message</div>
                    <div>
                        <button className="blue-btn" onClick={signMessage} disabled={!connect}>
                            Sign Message
                        </button>
                    </div>
                    <div className="sign">Result: {signMessageResult}</div>
                </div>
            </div>
        </div>
    );
}

export default SolanaDemo;
