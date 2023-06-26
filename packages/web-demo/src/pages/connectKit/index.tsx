import { ParticleChains, chains } from '@particle-network/common';
import {
    evmWallets,
    isEVMProvider,
    isMetaMask,
    solanaWallets
} from '@particle-network/connect';
import {
    ConnectButton,
    ModalProvider,
    useAccount,
    useConnectKit,
    useLanguage,
    useNetwork,
    useParticleConnect,
    useParticleProvider,
    useParticleTheme,
    useSwitchChains,
} from '@particle-network/connect-react-ui';
import './index.scss';

// import connect react ui styles
import '@particle-network/connect-react-ui/dist/index.css';

import { WalletEntryPosition } from '@particle-network/auth';
import { Button, Divider, Select, Space, notification } from 'antd';
import { useEffect } from 'react';
import Web3 from 'web3';
import { payloadV4 } from '../../components/EVM/SignTypedDatav4';

const getChains = () => {
    const sortKeys = [
        'Solana',
        'Ethereum',
        'BSC',
        'Polygon',
        'Avalanche',
        'Moonbeam',
        'Moonriver',
        'Heco',
        'Fantom',
        'Arbitrum',
        'Optimism',
        'KCC',
        'PlatOn',
    ];

    return Object.values(ParticleChains).sort((a, b) => {
        if (sortKeys.includes(a.name) && sortKeys.includes(b.name)) {
            if (sortKeys.indexOf(a.name) > sortKeys.indexOf(b.name)) {
                return 1;
            }
            return -1;
        } else if (sortKeys.includes(a.name)) {
            return -1;
        } else if (sortKeys.includes(b.name)) {
            return 1;
        }
        return 0;
    });
};

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
                chains: getChains(),
                particleWalletEntry: {
                    displayWalletEntry: true,
                    defaultWalletEntryPosition: WalletEntryPosition.BR,
                },
                // wallets: [metaMask(), rainbow(), omni(), argent()],
                wallets: [...evmWallets({ qrcode: true }), ...solanaWallets()],
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

    const isMetaMaskInjected =
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined' &&
        (window.ethereum.providers?.some(isMetaMask) || window.ethereum.isMetaMask);

    const connectMetaMask = () => {
        if (isMetaMaskInjected) {
            connect({
                id: 'metamask',
            });
        }
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

    const getBalance = async () => {
        const accouts = await (window.web3 as Web3).eth.getAccounts();
        const result = await (window.web3 as Web3).eth.getBalance(accouts[0]);
        notification.success({
            message: 'Get Balance Successful',
            description: result,
        });
    };

    const personalSign = async () => {
        const accouts = await (window.web3 as Web3).eth.getAccounts();
        const result = await (window.web3 as Web3).eth.personal.sign('Hello Particle!', accouts[0], '');
        notification.success({
            message: 'Personal Sign Successful',
            description: result,
        });
    };

    const signTypedData = async () => {
        const accouts = await (window.web3 as Web3).eth.getAccounts();
        const result = await window.web3.currentProvider.request({
            method: 'eth_signTypedData_v4',
            params: [accouts[0], JSON.stringify(payloadV4)],
        });
        notification.success({
            message: 'Sign Typed Data Successful',
            description: result,
        });
    };

    const sendTransaction = async () => {
        const accouts = await (window.web3 as Web3).eth.getAccounts();
        const result = await (window.web3 as Web3).eth.sendTransaction({
            from: accouts[0],
            to: '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e',
            value: window.web3.utils.toWei('0.001', chain?.name?.toLowerCase() === 'tron' ? 'mwei' : 'ether'),
        });
        notification.success({
            message: 'Send Native Token Successful',
            description: result.transactionHash,
        });
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
                    {isMetaMaskInjected && (
                        <img src={require('../../common/icons/metamask.png')} onClick={connectMetaMask}></img>
                    )}
                </Space>
            )}

            {account && connectId === 'particle' && (
                <Select
                    className="chain-selecter"
                    defaultValue={`${chain?.name}-${chain?.id}`}
                    onChange={switchChain}
                    value={`${chain?.name}-${chain?.id}`}
                    options={getChains().map((item) => {
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
                        <div className="modal-action">
                            <Button onClick={openConnectModal} disabled={!!account}>
                                Open Connect Modal
                            </Button>
                            <Button onClick={openAccountModal} disabled={!account}>
                                Open Account Modal
                            </Button>
                            <Button onClick={openChainModal} disabled={!account || !isSwtichChain}>
                                Open Switch Network
                            </Button>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
            {account && (
                <div className="connected-actions">
                    {provider && isEVMProvider(provider) && chain?.name?.toLowerCase() !== 'solana' && (
                        <>
                            <Button type="primary" onClick={getBalance}>
                                Get Balance
                            </Button>

                            <Button type="primary" onClick={personalSign}>
                                Personal Sign
                            </Button>

                            <Button type="primary" onClick={signTypedData}>
                                Sign Typed Data
                            </Button>

                            <Button type="primary" onClick={sendTransaction}>
                                Send Native Token (0.001)
                            </Button>
                        </>
                    )}

                    <Button type="primary" onClick={onDisconnect}>
                        Disconnect
                    </Button>
                </div>
            )}
        </div>
    );
};
