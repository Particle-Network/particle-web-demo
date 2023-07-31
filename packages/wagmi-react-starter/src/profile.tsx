import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ParticleAuthConnector, ParticleOptions } from './particleAuth';

const particleOptions: ParticleOptions = {
    projectId: process.env.REACT_APP_PROJECT_ID as string,
    clientKey: process.env.REACT_APP_CLIENT_KEY as string,
    appId: process.env.REACT_APP_APP_ID as string,
};

export default function Profile() {
    const { address } = useAccount();
    const { connect } = useConnect({
        connector: new ParticleAuthConnector({
            options: particleOptions,
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
            <button
                onClick={() => {
                    connect({
                        connector: new ParticleAuthConnector({
                            options: particleOptions,
                            loginOptions: {
                                preferredAuthType: 'google',
                            },
                        }),
                    });
                }}
            >
                Google
            </button>
            <button
                onClick={() => {
                    connect({
                        connector: new ParticleAuthConnector({
                            options: particleOptions,
                            loginOptions: {
                                preferredAuthType: 'twitter',
                            },
                        }),
                    });
                }}
            >
                Twitter
            </button>
        </div>
    );
}
