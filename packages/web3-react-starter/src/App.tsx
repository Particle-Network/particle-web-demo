import { Web3ReactProvider } from '@web3-react/core';
import Demo from './demo';
import React from 'react';

function App() {
    const getLibrary = (provider: any, connector: any) => {
        return provider;
    };
    return (
        <>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Demo />
            </Web3ReactProvider>
        </>
    );
}

export default App;
