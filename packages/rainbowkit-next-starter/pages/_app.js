import '../styles/globals.css';
import dynamic from 'next/dynamic';

const DynamicWagmi = dynamic(() => import('../src/components/dynamicWagmi/index'), {
    ssr: false,
});

function MyApp({ Component, pageProps }) {
    return (
        <DynamicWagmi>
            <Component {...pageProps} />
        </DynamicWagmi>
    );
}

export default MyApp;
