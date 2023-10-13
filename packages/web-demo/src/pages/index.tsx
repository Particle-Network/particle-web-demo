import {
    AuthType,
    AuthTypes,
    ParticleNetwork,
    SettingOption,
    WalletCustomStyle,
    WalletEntryPosition,
    isNullish,
    toBase58Address,
} from '@particle-network/auth';
import { ParticleChains } from '@particle-network/chains';
import type { MenuProps } from 'antd';
import { Badge, Button, Dropdown, Input, Menu, Popover, Switch, Tag, message, notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import AccountAvatar from '../components/AccountAvatar/AuthAvatar';
import DemoSetting from '../components/DemoSetting/index';
// import { customStyle as defCustomStyle } from '../types/customStyle';
import { fromSunFormat } from '../utils/number-utils';

import {
    AndroidOutlined,
    AppleOutlined,
    BarsOutlined,
    ContainerOutlined,
    CopyOutlined,
    DesktopOutlined,
    DownOutlined,
    FileTextOutlined,
    GithubOutlined,
    PlusSquareOutlined,
    RedoOutlined,
    ScanOutlined,
    TwitterOutlined,
} from '@ant-design/icons';
import { bufferToHex } from '@ethereumjs/util';
import { AAWrapProvider, SendTransactionMode, SmartAccount } from '@particle-network/aa';
import { ParticleProvider } from '@particle-network/provider';
import { SolanaWallet } from '@particle-network/solana-wallet';
import bs58 from 'bs58';
import QRCode from 'qrcode.react';
import Web3 from 'web3';
import aaOptions from '../common/config/erc4337';
import EVM from '../components/EVM';
import Solana from '../components/Solana';
import { DiscordIcon } from './icon';
import './index.scss';

function Home() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [loginState, setLoginState] = useState(false);
    const [balance, setBalance] = useState<number | string>(0);
    const [address, setAddress] = useState('');
    const [authorize, setAuthorize] = useState(false);
    const [authorizeUniq, setAuthorizeUniq] = useState(false);
    const [loginAccount, setLoginAccount] = useState<string>();
    const [authorizeMessage, setAuthorizeMessage] = useState<string>();
    const loadChainKey = () => {
        const key = localStorage.getItem('dapp_particle_chain_key');
        if (key && ParticleChains[key]) {
            return key;
        }
        return 'ethereum-1';
    };

    const [demoSetting, setDemosetting] = useState({
        loginAccount: '',
        chainKey: loadChainKey(),
        language: localStorage.getItem('dapp_particle_language') || 'en',
        promptMasterPasswordSettingWhenLogin: Number(
            localStorage.getItem('promptMasterPasswordSettingWhenLogin') || '2'
        ),
        promptSettingWhenSign: Number(localStorage.getItem('promptSettingWhenSign') || '1'),
        theme: localStorage.getItem('dapp_particle_theme') || 'light',
        // customStyle: localStorage.getItem('customStyle') || JSON.stringify(defCustomStyle),
        customStyle: localStorage.getItem('customStyle'),
        modalBorderRadius: Number(localStorage.getItem('dapp_particle_modal_border_radius') || 10),
        walletEntrance:
            localStorage.getItem('dapp_particle_walletentrance') === 'true' ||
            isNullish(localStorage.getItem('dapp_particle_walletentrance')),
        walletTheme: localStorage.getItem('dapp_particle_wallettheme') || 'light',
        fiatCoin: localStorage.getItem('web_demo_fiat_coin') || 'USD',
        erc4337: JSON.parse(localStorage.getItem('dapp_particle_erc4337_option') ?? 'false'),
    });

    useEffect(() => {
        if (loginState) {
            initAccount();
        }
    }, [loginState, demoSetting.chainKey, demoSetting.erc4337]);

    const particle = useMemo(() => {
        const {
            theme,
            modalBorderRadius,
            language,
            promptSettingWhenSign,
            promptMasterPasswordSettingWhenLogin,
            customStyle,
            walletEntrance,
            walletTheme,
            fiatCoin,
            erc4337,
        } = demoSetting;
        const chainChanged = (chain: any) => {
            initAccount();
        };
        const disconnect = () => {
            setLoginState(false);
        };
        if (window.particle) {
            window.particle.auth.off('chainChanged', chainChanged);
            window.particle.auth.off('disconnect', disconnect);
            window.particle.walletEntryDestroy();
        }
        const chainKey = localStorage.getItem('dapp_particle_chain_key') || 'ethereum-1';
        const chain = ParticleChains[chainKey];
        const particle = new ParticleNetwork({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chainName: chain?.name,
            chainId: chain?.id,
            securityAccount: {
                promptSettingWhenSign: promptSettingWhenSign as SettingOption,
                promptMasterPasswordSettingWhenLogin: promptMasterPasswordSettingWhenLogin as SettingOption,
            },
            wallet: {
                displayWalletEntry: walletEntrance,
                uiMode: walletTheme as any,
                defaultWalletEntryPosition: WalletEntryPosition.BR,
                customStyle: customStyle ? (JSON.parse(customStyle) as WalletCustomStyle) : undefined,
            },
        });
        particle.setAuthTheme({
            uiMode: theme as any,
            modalBorderRadius,
        });
        particle.setLanguage(language);

        particle.setFiatCoin((fiatCoin as any) || 'USD');

        particle.setERC4337(erc4337 as any);

        particle.auth.on('chainChanged', chainChanged);
        particle.auth.on('disconnect', disconnect);

        setLoginState(particle && particle.auth.isLogin());
        if (particle && particle.auth.isLogin()) {
            particle.auth
                .getSecurityAccount()
                .catch((error: any) => {
                    if (error.code === 10005 || error.code === 8005) {
                        logout();
                    }
                })
                .finally(() => {
                    setUpdateHasPassword(updateHasPassword + 1);
                });
        }
        const particleProvider = new ParticleProvider(particle.auth);

        if (erc4337) {
            const smartAccount = new SmartAccount(particleProvider, {
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
                aaOptions,
            });
            smartAccount.setSmartAccountType(erc4337.name)
            window.smartAccount = smartAccount;
            window.web3 = new Web3(new AAWrapProvider(smartAccount, SendTransactionMode.UserSelect) as any);
        } else {
            window.web3 = new Web3(particleProvider as any);
        }

        return particle;
    }, [
        demoSetting.promptSettingWhenSign,
        demoSetting.promptMasterPasswordSettingWhenLogin,
        demoSetting.customStyle,
        demoSetting.walletEntrance,
        demoSetting.walletTheme,
        demoSetting.theme,
        demoSetting.fiatCoin,
        demoSetting.erc4337,
    ]);

    const [updateHasPassword, setUpdateHasPassword] = useState(1);
    const hasPasswordDot = useMemo(() => {
        try {
            if (particle && loginState && updateHasPassword) {
                // @ts-ignore
                const has_set_payment_password = particle.auth.getUserInfo().security_account?.has_set_payment_password;
                // @ts-ignore
                const has_set_master_password = particle.auth.getUserInfo().security_account?.has_set_master_password;

                return has_set_payment_password && has_set_master_password;
            }
        } catch (error) {
            return false;
        }
        return false;
    }, [particle, loginState, updateHasPassword]);
    const isTron = () => {
        return particle && particle?.auth?.getChain()?.name?.toLowerCase() === 'tron';
    };
    const isSolana = () => {
        return particle && particle?.auth?.getChain()?.name?.toLowerCase() === 'solana';
    };

    const solanaWallet = useMemo(() => {
        return new SolanaWallet(particle.auth);
    }, [particle]);

    const initAccount = () => {
        if (particle.auth.isLogin()) {
            getAccounts();
            getBalance();
        }
    };

    const logout = () => {
        setLogoutLoading(true);
        particle.auth
            .logout(true)
            .then(() => {
                console.log('logout success');
                setBalance(0);
                setLoginState(false);
            })
            .catch((err) => {
                console.log('logout error', err);
            })
            .finally(() => {
                setLogoutLoading(false);
            });
    };

    const connectWallet = (type: AuthType) => {
        if (loginLoading) return;
        let input_content;
        if (type === 'email') {
            const regularExpression =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            input_content =
                loginAccount && regularExpression.test(loginAccount.toLowerCase()) ? loginAccount : undefined;
        } else if (type === 'phone') {
            const regularExpression = /^\+?\d{8,14}$/;
            input_content =
                loginAccount && regularExpression.test(loginAccount.toLowerCase()) ? loginAccount : undefined;
        } else if (type === 'jwt') {
            input_content = loginAccount ? loginAccount.trim() : undefined;
            if (!input_content) {
                setLoginLoading(false);
                return message.error('JWT can not empty!');
            } else {
                message.loading('custom loading...');
            }
        }

        setLoginLoading(true);

        const authorization = authorize
            ? {
                  message: authorizeMessage
                      ? demoSetting.chainKey.toLowerCase().includes('solana')
                          ? bs58.encode(Buffer.from(authorizeMessage))
                          : bufferToHex(Buffer.from(authorizeMessage))
                      : undefined,
                  uniq: authorizeUniq,
              }
            : undefined;

        console.log('login authorization', authorization);

        particle.auth
            .login({
                preferredAuthType: type,
                account: input_content,
                supportAuthTypes: 'all',
                socialLoginPrompt: 'consent',
                hideLoading: type === 'jwt',
                authorization,
            })
            .then((userInfo) => {
                setLoginState(true);
                setLoginLoading(false);
                if (userInfo.signature) {
                    notification.success({
                        message: 'Login And Authorize',
                        description: userInfo.signature,
                    });
                }
            })
            .catch((error: any) => {
                setLoginLoading(false);
                console.log('connect wallet', error);
                if (error.code !== 4011) {
                    message.error(error.message);
                }
            });
    };

    const getBalance = async () => {
        setBalance(0);
        if (isSolana()) {
            solanaWallet
                .getConnection()
                .getBalance(solanaWallet.publicKey!)
                .then((result) => {
                    setBalance((result / 1000000000).toFixed(4));
                });
            return void 0;
        }
        const accounts = await window.web3.eth.getAccounts();
        window.web3.eth.getBalance(accounts[0]).then((value: string) => {
            setBalance(isTron() ? fromSunFormat(value) : window.web3.utils.fromWei(value, 'ether'));
        });
    };

    const getAccounts = () => {
        if (isSolana()) {
            setAddress(solanaWallet.publicKey?.toBase58() || '');
            return void 0;
        }
        window.web3.eth.getAccounts((error: any, accounts: any[]) => {
            if (error) throw error;
            const account = accounts[0];
            if (isTron()) {
                setAddress(toBase58Address(account));
            } else {
                setAddress(account);
            }
        });
    };
    const getAddr = () => {
        if (address) {
            return address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length);
        }
        return '';
    };

    const openWindow = (url: string | URL | undefined) => window.open(url);

    const chainInfo = (key: string) => {
        return ParticleChains[key];
    };

    const menus: MenuProps['items'] = [
        {
            label: (
                <a href="/connectKit " target="_blank" rel="noopener noreferrer">
                    ConnectKit
                </a>
            ),
            key: 'ConnectKit',
        },
        {
            label: (
                <a href="/rainbowKit " target="_blank" rel="noopener noreferrer">
                    RainbowKit
                </a>
            ),
            key: 'rainbowKit',
        },
        {
            label: (
                <a href="/web3Modal " target="_blank" rel="noopener noreferrer">
                    Web3Modal
                </a>
            ),
            key: 'web3modal',
        },
        {
            label: (
                <a href="https://static.particle.network/sdks/web/index.html" target="_blank" rel="noopener noreferrer">
                    BrowserDemo
                </a>
            ),
            key: 'BrowserDemo',
        },
    ];

    const ConnectButtonFC = () => {
        if (loginState) {
            const items: MenuProps['items'] = [
                {
                    key: '1',
                    label: (
                        <div
                            style={{
                                height: '40px',
                                lineHeight: '40px',
                            }}
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                                message.success('Copied to clipboard');
                            }}
                        >
                            Copy Address
                        </div>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <div
                            style={{
                                color: '#ff4d4f',
                                fontWeight: 'bold',
                                height: '40px',
                                lineHeight: '40px',
                            }}
                            onClick={logout}
                        >
                            Disconnect
                        </div>
                    ),
                },
            ];

            return (
                <div className="header-info">
                    <div className="link-target">
                        <GithubOutlined
                            className="github"
                            size={24}
                            onClick={() => openWindow('https://github.com/Particle-Network/particle-web-demo')}
                        />
                    </div>
                    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                        <div className="address-info">
                            <AccountAvatar opts={{ seed: address, size: 24, scale: 1 }} />
                            <span>{getAddr()}</span>
                            <DownOutlined />
                        </div>
                    </Dropdown>
                </div>
            );
        }
        return (
            <div className="header-info">
                <div className="link-target">
                    <GithubOutlined
                        className="github"
                        size={24}
                        onClick={() => openWindow('https://github.com/Particle-Network/particle-web-demo')}
                    />
                </div>
                <Button loading={loginLoading} type="primary" onClick={() => connectWallet('email')}>
                    Connect
                </Button>
            </div>
        );
    };

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
    };

    const openBuy = () => {
        if (particle) {
            particle.openBuy();
        }
    };
    const openWallet = () => {
        if (particle) {
            particle.openWallet();
        }
    };
    const openAccountAndSecurity = () => {
        if (particle) {
            particle.auth
                .openAccountAndSecurity()
                .then((res) => {
                    setUpdateHasPassword(updateHasPassword + 1);
                })
                .catch((e) => {
                    setUpdateHasPassword(updateHasPassword + 1);
                    //ignore
                });
        }
    };

    const contect = () => <QRCode size={100} value={window.location.origin + '/qrcode'}></QRCode>;
    const contect2 = () => (
        <div className="menus-mobile-down">
            <p onClick={() => openWindow('/connectKit')}>ConnectKit</p>
            <p onClick={() => openWindow('/rainbowKit')}>RainbowKit</p>
            <p onClick={() => openWindow('/web3Modal')}>Web3Modal</p>
            <p onClick={() => openWindow('https://static.particle.network/sdks/web/index.html')}>BrowserDemo</p>
        </div>
    );

    const currentChain = useMemo(() => {
        return chainInfo(demoSetting.chainKey);
    }, [demoSetting.chainKey]);

    return (
        <div className="app-demo">
            <header className="app-header">
                <img src={require('../common/img/logo.png')} alt="" />
                <h1>Particle Demo</h1>
                <div className="menus">
                    <Menu className="menu" onClick={onClick} selectedKeys={['']} mode="horizontal" items={menus} />
                </div>

                <div className="menus-mobile">
                    <Popover content={contect2} trigger="click" placement="bottomLeft">
                        <BarsOutlined />
                    </Popover>
                    <div className="particle-title">Particle Demo</div>
                </div>
                <div className="connect-box">
                    <ConnectButtonFC></ConnectButtonFC>
                </div>
            </header>

            <div className="app-container">
                {/* <div className="left-container"></div> */}
                <div className="content-container">
                    <div className="logo-box card">
                        <h2 className="card-title">Particle Network</h2>
                        <h4 className="card-title2">
                            Full-stack Web3 infrastructure provider, To see some running examples of Particle Network,
                            or even use them to automatically scaffold a new project, check out the
                            <a href="https://github.com/Particle-Network/particle-web-demo"> official examples</a>.
                        </h4>

                        <div className="link-box">
                            <Tag
                                className="link-tag"
                                icon={<DesktopOutlined />}
                                color="#d242ca"
                                onClick={() => openWindow(' https://particle.network')}
                            >
                                Official Website
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<ContainerOutlined />}
                                color="#1890ff"
                                onClick={() => openWindow(' https://docs.particle.network')}
                            >
                                Developer Docs
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<TwitterOutlined />}
                                color="#55acee"
                                onClick={() => openWindow('https://twitter.com/ParticleNtwrk')}
                            >
                                Twitter
                            </Tag>

                            <Tag
                                className="link-tag"
                                icon={<DiscordIcon style={{ color: '#fff' }} />}
                                color="#5865f2"
                                onClick={() => openWindow('https://discord.com/invite/2y44qr6CR2')}
                            >
                                Discord
                            </Tag>
                        </div>
                    </div>

                    <div className="download-box card">
                        <h2 className="card-title" style={{ fontSize: 20 }}>
                            Download Demo
                        </h2>
                        <div className="link-box">
                            <Tag
                                className="link-tag"
                                icon={<AppleOutlined />}
                                color="#000"
                                onClick={() =>
                                    openWindow('https://apps.apple.com/us/app/particle-crypto-wallet/id1632425771')
                                }
                            >
                                Apple Store
                            </Tag>
                            <Tag
                                className="link-tag"
                                icon={<AndroidOutlined />}
                                color="#000"
                                onClick={() =>
                                    openWindow('https://play.google.com/store/apps/details?id=network.particle.auth')
                                }
                            >
                                Google Play
                            </Tag>

                            <Popover content={contect} trigger="click">
                                <Tag className="link-tag" icon={<ScanOutlined />} color="#000">
                                    <> QR Code</>
                                </Tag>
                            </Popover>
                        </div>
                    </div>

                    <div className="right-container">
                        {loginState ? (
                            <div className="login-box card">
                                <h2 className="login-box-title">Wallet Information</h2>
                                <h3>
                                    <span className="login-label">Address:</span>
                                    <span
                                        style={{ color: '#1890ff', cursor: 'pointer' }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(address);
                                            message.success('Copied to clipboard');
                                        }}
                                    >
                                        {getAddr()}
                                        <CopyOutlined style={{ marginLeft: 4 }} />
                                    </span>
                                </h3>
                                <h3>
                                    <span className="login-label">Balance:</span>
                                    <span>
                                        {balance} {ParticleChains[demoSetting.chainKey].nativeCurrency.symbol}
                                        <RedoOutlined
                                            onClick={() => getBalance()}
                                            style={{ marginLeft: 5, color: '#1890ff', cursor: 'pointer' }}
                                        />
                                        {/* @ts-ignore */}
                                        {currentChain?.faucetUrl && (
                                            <PlusSquareOutlined
                                                // @ts-ignore
                                                onClick={() => openWindow(currentChain?.faucetUrl)}
                                                style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
                                            />
                                        )}
                                    </span>
                                </h3>

                                <h3>
                                    <span className="login-label">Chain:</span>
                                    <span>{chainInfo(demoSetting.chainKey).fullname}</span>
                                </h3>
                                <br />
                                <p className="center-center flex-column">
                                    <div className="button-group">
                                        <Button type="primary" className="login-button" onClick={openBuy}>
                                            Buy
                                        </Button>
                                        <Button
                                            className="button-doc"
                                            onClick={() =>
                                                openWindow(
                                                    'https://docs.particle.network/auth-service/sdks/web#open-crypto-token-buy'
                                                )
                                            }
                                        >
                                            <FileTextOutlined />
                                        </Button>
                                    </div>
                                    <div className="button-group">
                                        <Button type="primary" className="login-button" onClick={openWallet}>
                                            Wallet
                                        </Button>
                                        <Button
                                            className="button-doc"
                                            onClick={() =>
                                                openWindow(
                                                    'https://docs.particle.network/auth-service/sdks/web#open-particle-web-wallet'
                                                )
                                            }
                                        >
                                            <FileTextOutlined />
                                        </Button>
                                    </div>
                                    <div className="button-group">
                                        <Button
                                            type="primary"
                                            className="login-button"
                                            onClick={openAccountAndSecurity}
                                        >
                                            Account And Security
                                            {!hasPasswordDot && <Badge dot={true}></Badge>}
                                        </Button>
                                        <Button
                                            className="button-doc"
                                            onClick={() =>
                                                openWindow(
                                                    'https://docs.particle.network/auth-service/sdks/web#security-account'
                                                )
                                            }
                                        >
                                            <FileTextOutlined />
                                        </Button>
                                    </div>

                                    <Button
                                        loading={logoutLoading}
                                        type="primary"
                                        danger
                                        className="login-button"
                                        onClick={logout}
                                    >
                                        Disconnect
                                    </Button>
                                </p>
                            </div>
                        ) : (
                            <div className="login-box card">
                                <h2 className="login-box-title">Login Methods</h2>

                                <div className="login-option-item">
                                    Authorize
                                    <Switch
                                        checked={authorize}
                                        defaultChecked={authorize}
                                        onChange={(checked: boolean) => setAuthorize(checked)}
                                    ></Switch>
                                </div>

                                {authorize && (
                                    <>
                                        <div className="login-option-item">
                                            Unique
                                            <Switch
                                                checked={authorizeUniq}
                                                defaultChecked={authorizeUniq}
                                                onChange={(checked: boolean) => setAuthorizeUniq(checked)}
                                            ></Switch>
                                        </div>
                                        <Input.TextArea
                                            className="authorize-message-input"
                                            placeholder="authorize message &#10;evm: optional&#10;solana: required"
                                            value={authorizeMessage}
                                            autoSize={true}
                                            onChange={(e) => setAuthorizeMessage(e.target.value)}
                                        ></Input.TextArea>
                                    </>
                                )}

                                <p className="center-center">
                                    <Input.TextArea
                                        className="input-account"
                                        value={loginAccount}
                                        onChange={(e) => setLoginAccount(e.target.value)}
                                        autoSize={true}
                                        placeholder="optional: login account &#10;email: developer@particle.com&#10;phone(E.164): +8618888888888&#10;JWT: json web token"
                                    ></Input.TextArea>
                                </p>

                                <p className="center-center">
                                    <Button
                                        loading={loginLoading}
                                        type="primary"
                                        className="login-button"
                                        onClick={() => connectWallet('email')}
                                    >
                                        Connect
                                    </Button>
                                </p>

                                <div className="login-methods">
                                    {AuthTypes.map((type) => {
                                        return (
                                            <img
                                                key={type}
                                                className="method-item"
                                                src={require(`../common/images/${type}_icon.png`)}
                                                alt=""
                                                onClick={() => connectWallet(type)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <DemoSetting
                            onChange={setDemosetting}
                            value={demoSetting}
                            particle={particle}
                            isLogin={loginState}
                        />
                    </div>

                    {isSolana() ? (
                        <Solana
                            demoSetting={demoSetting}
                            loginState={loginState}
                            address={address}
                            solanaWallet={solanaWallet}
                        ></Solana>
                    ) : (
                        <EVM demoSetting={demoSetting} loginState={loginState} isTron={isTron()}></EVM>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
