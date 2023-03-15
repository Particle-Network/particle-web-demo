import {
    ModalProvider,
    ConnectButton,
    useParticleProvider,
    useConnectKit,
    useAccount,
    useParticleTheme,
    useLanguage,
    useSwitchChains,
    useParticleConnect,
    useNetwork,
} from '@particle-network/connect-react-ui';
import { ParticleChains, chains } from '@particle-network/common';
import { evmWallets, solanaWallets, isEVMProvider } from '@particle-network/connect';
import './index.scss';

// import connect react ui styles
import '@particle-network/connect-react-ui/dist/index.css';

import { useEffect } from 'react';
import { Button, Divider, Select, Space } from 'antd';
import Web3 from 'web3';
import { WalletEntryPosition } from '@particle-network/auth';

const PageConnectKit = () => {
    return (
        <ModalProvider
            particleAuthSort={[
                'email',
                'phone',
                'google',
                'apple',
                'twitter',
                'facebook',
                'microsoft',
                'linkedin',
                'github',
                'twitch',
                'discord',
            ]}
            options={{
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
                chains: Object.values(ParticleChains),
                particleWalletEntry: {
                    displayWalletEntry: true,
                    defaultWalletEntryPosition: WalletEntryPosition.BR,
                },
                wallets: [...evmWallets({ qrcode: false }), ...solanaWallets()],
                // @ts-ignore
                securityAccount: {
                    promptSettingWhenSign: 1,
                    promptMasterPasswordSettingWhenLogin: 2,
                },
            }}
            theme="auto"
        >
            <ConnectContent></ConnectContent>
        </ModalProvider>
    );
};
export default PageConnectKit;

const ConnectContent = () => {
    const provider = useParticleProvider();

    const account = useAccount();

    const connectKit = useConnectKit();

    const { theme, setTheme } = useParticleTheme();

    const { language, changLanguage } = useLanguage();

    const { isSwtichChain } = useSwitchChains();

    const { connect, disconnect } = useParticleConnect();

    const { chain, connectId } = useNetwork();

    useEffect(() => {
        if (provider && isEVMProvider(provider)) {
            window.web3 = new Web3(provider as any);
        }
    }, [provider]);

    const connectMetaMask = () => {
        connect({
            id: 'metamask',
        });
    };

    const connectParticleWithGoogle = () => {
        connect({
            id: 'particle',
            preferredAuthType: 'google',
        });
    };

    const onDisconnect = () => {
        disconnect({ hideLoading: true });
    };

    const switchChain = (value: string) => {
        const info = value.split('-');
        const name = info[0];
        const id = Number(info[1]);
        const chain = chains.getChainInfo({ id, name });
        if (chain) {
            connectKit.switchChain(chain);
        }
    };

    return (
        <div className="connectkit-box">
            <a
                className="developer-docs"
                href="https://docs.particle.network/connect-service/"
                target="_blank"
                rel="noreferrer"
            >
                Developer Documentation
            </a>
            <div className="connect-btn">
                <ConnectButton />
            </div>

            <Divider className="connectkit-divider">Custom Style</Divider>

            {!account && (
                <Space className="connect-custom">
                    <img src={require('../../common/images/google_icon.png')} onClick={connectParticleWithGoogle}></img>
                    <img src={require('../../common/icons/metamask.png')} onClick={connectMetaMask}></img>
                </Space>
            )}

            {account && connectId === 'particle' && (
                <Select
                    className="chain-selecter"
                    defaultValue={`${chain?.name}-${chain?.id}`}
                    onChange={switchChain}
                    value={`${chain?.name}-${chain?.id}`}
                    options={Object.values(ParticleChains).map((item) => {
                        return { value: `${item.name}-${item.id}`, label: item.fullname };
                    })}
                />
            )}

            <p>Current Theme: {theme}</p>

            <div>
                <Button onClick={() => setTheme?.('auto')} style={{ marginRight: 10 }}>
                    auto
                </Button>
                <Button onClick={() => setTheme?.('dark')}>dark</Button>
                <Button onClick={() => setTheme?.('light')} style={{ marginLeft: 10 }}>
                    light
                </Button>
            </div>

            <br />

            <p>Current Language: {language}</p>
            <div className="language-box">
                <Button onClick={() => changLanguage?.('en_US')} style={{ marginRight: 10 }}>
                    en_US
                </Button>
                <Button onClick={() => changLanguage?.('zh_CN')} style={{ marginRight: 10 }}>
                    zh_CN
                </Button>
                <Button onClick={() => changLanguage?.('zh_TW')}>zh_TW</Button>
                <Button onClick={() => changLanguage?.('ko_KR')} style={{ marginLeft: 10 }}>
                    ko_KR
                </Button>
                <Button onClick={() => changLanguage?.('ja_JP')} style={{ marginLeft: 10 }}>
                    ja_JP
                </Button>
            </div>
            <br />
            <ConnectButton.Custom>
                {({ account, openAccountModal, openConnectModal, openChainModal }) => {
                    return (
                        <>
                            <Button onClick={openConnectModal} disabled={!!account}>
                                Open Connect Modal
                            </Button>
                            <br />
                            <Button onClick={openAccountModal} style={{ marginLeft: 10 }} disabled={!account}>
                                Open Account Modal
                            </Button>
                            <br />
                            <Button
                                onClick={openChainModal}
                                style={{ marginLeft: 10, marginBottom: 20 }}
                                disabled={!account || !isSwtichChain}
                            >
                                Open Switch Network
                            </Button>
                        </>
                    );
                }}
            </ConnectButton.Custom>
            {account && (
                <Button type="primary" onClick={onDisconnect} style={{ marginBottom: 20 }}>
                    Disconnect
                </Button>
            )}
        </div>
    );
};
