import { useWeb3React } from '@web3-react/core';
import React, { useMemo } from 'react';
import { injected, ParticleConnector, walletconnect } from './connector';

const Demo = () => {
    const { activate, chainId, account } = useWeb3React();

    const particle = useMemo(
        () =>
            //TODO: get particle config from https://dashboard.particle.network/
            new ParticleConnector({
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
                chainId: 1,
                chainName: 'Ethereum',
            }),
        []
    );

    return (
        <div>
            <div>{chainId}</div>
            <div>{account}</div>
            <button onClick={() => activate(walletconnect)}>Activate Walletconnect</button>
            <button onClick={() => activate(injected)}>Activate Injected</button>
            <button onClick={() => activate(particle)}>Activate Particle</button>
        </div>
    );
};

export default Demo;
