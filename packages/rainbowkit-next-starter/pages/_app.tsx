import '../styles/globals.css';
import DynamicWagmi from '../src/components/dynamicWagmi';

function MyApp({ Component, pageProps }: any) {
    return (
        <DynamicWagmi>
            <Component {...pageProps} />
        </DynamicWagmi>
    );
}

export default MyApp;
