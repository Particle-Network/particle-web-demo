import React from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import Profile from './profile';

const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
});

function App() {
    return (
        <WagmiConfig client={client}>
            <Profile />
        </WagmiConfig>
    );
}

export default App;
