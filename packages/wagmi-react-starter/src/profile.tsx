import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ParticleAuthConnector, ParticleOptions } from './particleAuth';
import './proflie.scss';

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

    return (
        <div className="content-body">
            {address ? (
                <button className="btn" onClick={() => disconnect()}>
                    Disconnect
                </button>
            ) : (
                <>
                    <button className="btn" onClick={() => connect()}>
                        Connect Wallet
                    </button>

                    <button
                        className="btn"
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
                        className="btn"
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
                </>
            )}

            {address && <div>Wallet Address: {address}</div>}
        </div>
    );
}
