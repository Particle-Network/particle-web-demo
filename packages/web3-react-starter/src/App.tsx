import { AuthType } from '@particle-network/auth';
import React, { useEffect } from 'react';
import './App.css';
import { hooks, particleAuth } from './particleAuthConnector';
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = hooks;

function App() {
    const chainId = useChainId();
    const accounts = useAccounts();
    const isActivating = useIsActivating();

    const isActive = useIsActive();

    const provider = useProvider();

    useEffect(() => {
        particleAuth.connectEagerly().catch(() => {
            console.debug('Failed to connect eagerly to particle wallet');
        });
    }, []);

    const connect = async (type: AuthType) => {
        await particleAuth.activate({
            preferredAuthType: type,
        });
        //@ts-ignore
        const userInfo = window.particle.auth.getUserInfo();
        console.log('particle userInfo', userInfo);
    };

    const disconnect = () => {
        particleAuth.deactivate().catch((e) => console.log('disconnect error', e));
    };

    return (
        <div className="App">
            <div>{`chainId: ${chainId}`}</div>
            <div>{`accounts: ${accounts}`}</div>
            <div>{`isActivating: ${isActivating}`}</div>
            <div>{`isActive: ${isActive}`}</div>
            {isActive ? (
                <button onClick={disconnect}>Disconnect</button>
            ) : (
                <>
                    <button onClick={() => connect('google')}>Connect With Google</button>
                    <button onClick={() => connect('twitter')}>Connect With Twitter</button>
                </>
            )}
        </div>
    );
}

export default App;
