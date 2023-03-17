import React, { useCallback, useEffect } from 'react';
import './App.css';
import EvmDemo from './connect-evm-demo';
import {
    Chain,
    ConnectButton,
    useAccount,
    useConnectKit,
    useParticleTheme,
    useSwitchChains,
    useParticleProvider,
    useLanguage,
} from '@particle-network/connect-react-ui';

import '@particle-network/connect-react-ui/dist/index.css';
import { LoginOptions } from '@particle-network/auth';

function App() {
    const account = useAccount();
    const connectKit = useConnectKit();
    const { theme, setTheme } = useParticleTheme();
    const { language, changLanguage } = useLanguage();

    const provider = useParticleProvider();

    const { isSwtichChain, renderChains } = useSwitchChains();

    useEffect(() => {
        async function chainChanged(chain?: Chain) {
            console.log('DEMO-onChainChanged：', chain);
        }
        if (connectKit) {
            connectKit.on('chainChanged', chainChanged);
            return () => {
                connectKit.removeListener('chainChanged', chainChanged);
            };
        }
    }, [connectKit]);

    const LogRenderChains = useCallback(() => {
        console.log('isSwtichChain:', isSwtichChain);
        console.log('renderChains:', renderChains);
    }, [renderChains, isSwtichChain]);

    return (
        <div className="App">
            <ConnectButton></ConnectButton>
            <h3>account</h3>
            <p>{account}</p>

            <div>
                <p>theme: {theme}</p>
                <div>
                    <button onClick={() => setTheme?.('auto')} style={{ marginRight: 10 }}>
                        auto
                    </button>
                    <button onClick={() => setTheme?.('dark')}>dark</button>
                    <button onClick={() => setTheme?.('light')} style={{ marginLeft: 10 }}>
                        light
                    </button>
                </div>
            </div>
            <br />

            <div>
                <p>language: {language}</p>
                <div>
                    <button onClick={() => changLanguage?.('en_US')} style={{ marginRight: 10 }}>
                        en_US
                    </button>
                    <button onClick={() => changLanguage?.('zh_CN')} style={{ marginRight: 10 }}>
                        zh_CN
                    </button>
                    <button onClick={() => changLanguage?.('zh_TW')}>zh_TW</button>
                    <button onClick={() => changLanguage?.('ko_KR')} style={{ marginLeft: 10 }}>
                        ko_KR
                    </button>
                    <button onClick={() => changLanguage?.('ja_JP')} style={{ marginLeft: 10 }}>
                        ja_JP
                    </button>
                </div>
            </div>
            <br />
            <ConnectButton.Custom>
                {({ account, accountLoading, chain, openAccountModal, openConnectModal, openChainModal }) => {
                    return (
                        <div>
                            <button onClick={openConnectModal} disabled={!!account}>
                                Open Connect
                            </button>
                            <br />
                            <br />
                            <button onClick={openAccountModal} style={{ marginLeft: 10 }} disabled={!account}>
                                Open Account
                            </button>
                            <br />
                            <br />
                            <button onClick={openChainModal} style={{ marginLeft: 10 }} disabled={!account}>
                                Open Switch Network
                            </button>

                            <div>
                                <h3>{`isSwtichChain: ${isSwtichChain}`}</h3>
                            </div>

                            <button onClick={LogRenderChains} style={{ marginLeft: 10 }}>
                                Log RenderChains
                            </button>

                            <div>
                                <h3>chain</h3>
                                <p>{JSON.stringify(chain ?? {})}</p>
                            </div>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
            {account && <EvmDemo />}
        </div>
    );
}

export default App;
