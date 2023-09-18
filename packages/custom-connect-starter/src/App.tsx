import { Ethereum, EthereumGoerli } from '@particle-network/chains';
import {
    ParticleConnect,
    Provider,
    coinbase,
    isEVMProvider,
    isSolanaProvider,
    metaMask,
    rainbow,
    walletconnect,
} from '@particle-network/connect';
import { Button, Divider, Modal, message, notification } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';

function App() {
    const [provider, setProvider] = useState<Provider>();

    const [connectModal, setConnectModal] = useState(false);
    const [address, setAddress] = useState<string>();

    const connectKit = useMemo(() => {
        return new ParticleConnect({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chains: [Ethereum, EthereumGoerli],
            wallets: [
                metaMask({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
                rainbow({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
                coinbase(),
                walletconnect({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
            ],
        });
    }, []);

    const connectWallet = async (id: string, options?: any) => {
        console.log('connectWallet', id, options);
        setConnectModal(false);
        try {
            const connectProvider = await connectKit.connect(id, options);
            setProvider(connectProvider);
        } catch (error) {
            console.error('connectWallet', error);
            message.error(error.message ?? error);
        }
    };

    const disconnectWallet = async () => {
        try {
            await connectKit.disconnect({ hideLoading: true });
        } catch (error) {
            console.error(error);
        }
        setProvider(null);
    };

    useEffect(() => {
        const id = connectKit.cachedProviderId();
        if (id) {
            connectKit
                .connectToCachedProvider()
                .then((provider) => {
                    setProvider(provider);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setProvider(null);
        }

        const onDisconnect = () => {
            setProvider(null);
        };

        connectKit.on('disconnect', onDisconnect);

        return () => {
            connectKit.removeListener('disconnect', onDisconnect);
        };
    }, [connectKit]);

    useEffect(() => {
        if (provider) {
            getAddress();
        } else {
            setAddress(undefined);
        }
    }, [provider]);

    const personalSign = useCallback(async () => {
        if (address && provider && isEVMProvider(provider)) {
            try {
                const result = await provider.request({
                    method: 'personal_sign',
                    params: ['0x48656c6c6f20576f726c64', address],
                });
                notification.success({
                    message: 'Personal Sign',
                    description: result,
                });
            } catch (error) {
                console.log('personal_sign', error);
            }
        }
    }, [provider, address]);

    const getAddress = async () => {
        if (isEVMProvider(provider)) {
            const addresses = await provider.request({ method: 'eth_accounts' });
            setAddress(addresses[0]);
        } else if (isSolanaProvider(provider)) {
            const address = provider.publicKey.toBase58();
            setAddress(address);
        }
    };

    return (
        <div className="app">
            <div className="app-title">Custom ConnectKit</div>
            {provider !== undefined &&
                (provider ? (
                    <Button className="btn-action" size="large" type="primary" onClick={disconnectWallet}>
                        Disconnect
                    </Button>
                ) : (
                    <Button className="btn-action" size="large" type="primary" onClick={() => setConnectModal(true)}>
                        Connect
                    </Button>
                ))}

            {address && (
                <>
                    <div className="address">{address}</div>
                    <Button className="btn-action" size="large" type="primary" onClick={personalSign}>
                        Personal Sign
                    </Button>
                </>
            )}

            <Modal
                className="connect-modal"
                title="Connect Wallet"
                open={connectModal}
                onCancel={() => setConnectModal(false)}
                footer
                centered
            >
                <div className="wallet-items">
                    <div onClick={() => connectWallet('metamask')}>
                        MetaMask
                        <img src={require('./assets/metamask_icon.png')} alt=""></img>
                    </div>
                    <div onClick={() => connectWallet('walletconnect_v2')}>
                        WalletConnect <img src={require('./assets/walletconnect_icon.png')} alt=""></img>
                    </div>
                </div>

                <Divider>Or connect with Particle Wallet</Divider>

                <div className="particle-methods">
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'email' })}
                        src={require('./assets/email_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'phone' })}
                        src={require('./assets/phone_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'twitter' })}
                        src={require('./assets/twitter_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'google' })}
                        src={require('./assets/google_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'apple' })}
                        src={require('./assets/apple_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'facebook' })}
                        src={require('./assets/facebook_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'discord' })}
                        src={require('./assets/discord_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'github' })}
                        src={require('./assets/github_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'linkedin' })}
                        src={require('./assets/linkedin_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'microsoft' })}
                        src={require('./assets/microsoft_icon.png')}
                        alt=""
                    ></img>
                    <img
                        onClick={() => connectWallet('particle', { preferredAuthType: 'twitch' })}
                        src={require('./assets/twitch_icon.png')}
                        alt=""
                    ></img>
                </div>
            </Modal>
        </div>
    );
}

export default App;
