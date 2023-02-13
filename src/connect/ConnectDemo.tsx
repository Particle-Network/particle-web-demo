import {
    ModalProvider,
    ConnectButton,
    useAccount,
    evmWallets,
    useParticleProvider,
    useConnectKit,
} from '@particle-network/connect-react-ui';
import './ConnectDemo.css';
import EvmDemo from './connect-evm-demo';
import '@particle-network/connect-react-ui/dist/index.css';
import {
    isEVMProvider,
    solanaWallets,
    PlatON,
    Optimism,
    Moonbeam,
    Moonriver,
    Avalanche,
    Polygon,
    BSC,
    Ethereum,
    EthereumGoerli,
    Solana,
} from '@particle-network/connect';
import ConnectSolanaDemo from './connect-solana-demo';
import { useEffect } from 'react';

export default function ConnectDemo() {
    return (
        <ModalProvider
            particleAuthSort={[
                'email',
                'phone',
                'google',
                'apple',
                'facebook',
                'microsoft',
                'linkedin',
                'github',
                'discord',
            ]}
            options={{
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,

                chains: [
                    PlatON,
                    Optimism,
                    Moonbeam,
                    Moonriver,
                    Avalanche,
                    Polygon,
                    BSC,
                    Ethereum,
                    EthereumGoerli,
                    Solana,
                ],
                wallets: [...evmWallets({ qrcode: false }), ...solanaWallets()],
            }}
            theme={(localStorage.getItem('dapp_particle_theme') ?? 'light') as 'light' | 'auto' | 'dark'}
        >
            <ConnectContent></ConnectContent>
        </ModalProvider>
    );
}

function ConnectContent() {
    const account = useAccount();
    const provider = useParticleProvider();
    const connectKit = useConnectKit();

    useEffect(() => {
        connectKit.on('disconnect', () => {
            console.log('connectKit disconnect');
        });
        connectKit.on('accountsChanged', (accounts) => {
            console.log('connectKit accountsChanged', accounts);
        });
    }, []);

    return (
        <div>
            <div className="bt-connect">
                <ConnectButton></ConnectButton>
            </div>
            {account && provider && (isEVMProvider(provider) ? <EvmDemo></EvmDemo> : <ConnectSolanaDemo />)}
        </div>
    );
}
