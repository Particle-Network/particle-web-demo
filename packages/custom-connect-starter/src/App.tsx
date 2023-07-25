import { Ethereum, EthereumGoerli } from '@particle-network/chains';
import { ParticleConnect, metaMask, walletconnect } from '@particle-network/connect';
import React, { useMemo, useState } from 'react';
import './App.css';

function App() {
    const [provider, setProvider] = useState<any>();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const connectKit = useMemo(() => {
        return new ParticleConnect({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chains: [Ethereum, EthereumGoerli],
            wallets: [
                metaMask({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
                walletconnect({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID }),
            ],
        });
    }, []);

    const connectWallet = async (id: string, options?: any) => {
        console.log('connectWallet', id, options);
        try {
            const connectProvider = await connectKit.connect(id, options);
            setProvider(connectProvider);
        } catch (error) {
            console.error('connectWallet', error);
        }
    };

    return (
        <div className="App">
            <button className="btn" onClick={() => connectWallet('metamask')}>
                MetaMask
            </button>
            <button className="btn" onClick={() => connectWallet('walletconnect_v2')}>
                WalletConnect
            </button>
            <button className="btn" onClick={() => connectWallet('particle')}>
                Particle
            </button>

            <button className="btn" onClick={() => connectWallet('particle', { preferredAuthType: 'google' })}>
                Connect With Google
            </button>
            <form>
                {/* @ts-ignore */}

                <input onInput={(e) => setEmail(e.target.value)}></input>
                <input
                    className="btn"
                    type="submit"
                    value="Connect With Email"
                    onClick={() => connectWallet('particle', { preferredAuthType: 'email', account: email })}
                />
            </form>

            <form>
                {/* @ts-ignore */}
                <input onInput={(e) => setPhone(e.target.value)} />
                <input
                    className="btn"
                    type="submit"
                    value="Connect With Phone"
                    onClick={() => connectWallet('particle', { preferredAuthType: 'phone', account: '+86' + phone })}
                />
            </form>
        </div>
    );
}

export default App;
