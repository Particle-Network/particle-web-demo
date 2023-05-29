import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ParticleAuthConnector } from './particleAuth';

export default function Profile() {
    const { address } = useAccount();
    const { connect } = useConnect({
        connector: new ParticleAuthConnector({
            options: {
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
            },
        }),
    });
    const { disconnect } = useDisconnect();

    if (address)
        return (
            <div>
                Connected to {address}
                <button onClick={() => disconnect()}>Disconnect</button>
            </div>
        );
    return (
        <div>
            <button onClick={() => connect()}>Connect Wallet</button>
        </div>
    );
}
