import WagmiProvider from '../src/wagmiProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: any) {
    return (
        <WagmiProvider>
            <Component {...pageProps} />
        </WagmiProvider>
    );
}

export default MyApp;
