import '../styles/globals.css';
import {
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
    BSCTestnet,
    KCCTestnet,
} from '@particle-network/common';
import { evmWallets, solanaWallets } from '@particle-network/connect';
import { ModalProvider } from '@particle-network/connect-react-ui';
import { WalletEntryPosition } from '@particle-network/auth';
import '@particle-network/connect-react-ui/esm/index.css';

function MyApp({ Component, pageProps }) {
    return (
        <ModalProvider
            walletSort={['Particle Auth', 'Wallet']}
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
                projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
                clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
                appId: process.env.NEXT_PUBLIC_APP_ID,
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
                    BSCTestnet,
                    KCCTestnet,
                ],
                particleWalletEntry: {
                    displayWalletEntry: true,
                    defaultWalletEntryPosition: WalletEntryPosition.BR,
                    supportChains: [Ethereum, EthereumGoerli],
                },
                wallets: [...evmWallets({ qrcode: false }), ...solanaWallets()],
            }}
            language="en"
            theme={'light'}
        >
            <Component {...pageProps} />
        </ModalProvider>
    );
}

export default MyApp;
