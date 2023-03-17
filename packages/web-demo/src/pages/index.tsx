import React, { useMemo, useState, useEffect } from 'react';
import { Button, Menu, Badge, Input, message, Tag, Dropdown, Popover } from 'antd';
import type { MenuProps } from 'antd';
import { SettingOption, toBase58Address } from '@particle-network/auth';
import SendETH from '../components/EVM/SendETH/index';
import SendERC20Tokens from '../components/EVM/SendERC20Tokens/index';
import SendERC721Tokens from '../components/EVM/SendERC721Tokens/index';
import SendERC1155Tokens from '../components/EVM/SendERC1155Tokens/index';
import SendERC20Approve from '../components/EVM/SendERC20Approve/index';
import ContractCall from '../components/EVM/ContractCall/index';
import PersonalSign from '../components/EVM/PersonalSign/index';
import SignTypedDatav1 from '../components/EVM/SignTypedDatav1/index';
import SignTypedDatav3 from '../components/EVM/SignTypedDatav3/index';
import SignTypedDatav4 from '../components/EVM/SignTypedDatav4/index';
import SignSolanaTransaction from '../components/Solana/SignTransaction/index';
import SolanaTransaction from '../components/Solana/Transaction/index';
import SolanaAllTransaction from '../components/Solana/AllTransaction/index';
import SolanaSignMessage from '../components/Solana/SignMessage/index';
import DemoSetting from '../components/DemoSetting/index';
import AccountAvatar from '../components/AccountAvatar/AuthAvatar';
import { ParticleNetwork, WalletCustomStyle, WalletEntryPosition } from '@particle-network/auth';
import { ParticleChains } from '@particle-network/common';
import { AuthType, AuthTypes } from '@particle-network/auth';
import { fromSunFormat } from '../utils/number-utils';
import {
    DesktopOutlined,
    ContainerOutlined,
    TwitterOutlined,
    ScanOutlined,
    AndroidOutlined,
    AppleOutlined,
    GithubOutlined,
    SafetyOutlined,
    DownOutlined,
    CopyOutlined,
    BarsOutlined,
    RedoOutlined,
    LinkOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import './index.scss';
import { DiscordIcon } from './icon';
import { ParticleProvider } from '@particle-network/provider';
import { SolanaWallet } from '@particle-network/solana-wallet';
import Web3 from 'web3';
import QRCode from 'qrcode.react';

function Home() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [loginState, setLoginState] = useState(false);
    const [balance, setBalance] = useState<number | string>(0);
    const [address, setAddress] = useState('');
    const [loginAccount, setLoginAccount] = useState<string>();
    const loadChainKey = () => {
        const key = localStorage.getItem('dapp_particle_chain_key');
        if (key && ParticleChains[key]) {
            return key;
        }
        return 'Ethereum';
    };

    const [demoSetting, setDemosetting] = useState({
        loginAccount: '',
        chainKey: loadChainKey(),
        language: localStorage.getItem('dapp_particle_language') || 'en',
        loginFormMode: !!localStorage.getItem('dapp_particle_form_mode') ? 'true' : 'false',
        promptMasterPasswordSettingWhenLogin: Number(
            localStorage.getItem('promptMasterPasswordSettingWhenLogin') || '2'
        ),
        promptSettingWhenSign: Number(localStorage.getItem('promptSettingWhenSign') || '1'),
        theme: localStorage.getItem('dapp_particle_theme') || 'light',
        customStyle: localStorage.getItem('customStyle'),
        modalBorderRadius: Number(localStorage.getItem('dapp_particle_modal_border_radius') || 10),
    });

    useEffect(() => {
        if (loginState) {
            initAccount();
        }
    }, [loginState, demoSetting.chainKey]);

    const particle = useMemo(() => {
        const { promptSettingWhenSign, promptMasterPasswordSettingWhenLogin, customStyle } = demoSetting;
        const chainChanged = (chain: any) => {
            initAccount();
        };
        const disconnect = () => {
            setLoginState(false);
        };
        if (window.particle) {
            window.particle.auth.off('chainChanged', chainChanged);
            window.particle.auth.off('disconnect', disconnect);
        }
        const chainKey = localStorage.getItem('dapp_particle_chain_key') || 'Ethereum';
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
                displayWalletEntry: true,
                defaultWalletEntryPosition: WalletEntryPosition.BR,
                customStyle: customStyle ? (JSON.parse(customStyle) as WalletCustomStyle) : undefined,
            },
        });

        particle.auth.on('chainChanged', chainChanged);
        particle.auth.on('disconnect', disconnect);

        setLoginState(particle && particle.auth.isLogin());
        if (particle && particle.auth.isLogin()) {
            particle.auth
                .getUserSimpleInfo()
                .catch((error: any) => {
                    if (error.code === 10005) {
                        logout();
                    }
                })
                .finally(() => {
                    setUpdateHasPassword(updateHasPassword + 1);
                });
        }
        const particleProvider = new ParticleProvider(particle.auth);
        window.web3 = new Web3(particleProvider as any | ParticleProvider);
        return particle;
    }, [demoSetting.promptSettingWhenSign, demoSetting.promptMasterPasswordSettingWhenLogin, demoSetting.customStyle]);

    const [updateHasPassword, setUpdateHasPassword] = useState(1);
    const hasPasswordDot = useMemo(() => {
        try {
            if (particle && loginState && updateHasPassword) {
                // @ts-ignore
                const has_set_payment_password = particle.auth.userInfo().security_account?.has_set_payment_password;
                // @ts-ignore
                const has_set_master_password = particle.auth.userInfo().security_account?.has_set_master_password;
                return has_set_payment_password && has_set_master_password;
            }
        } catch (error) {
            return false;
        }
        return false;
    }, [particle, loginState, updateHasPassword]);
    const isTron = () => {
        return particle && particle?.auth?.chain()?.name?.toLowerCase() === 'tron';
    };
    const isSolana = () => {
        return particle && particle?.auth?.chain()?.name?.toLowerCase() === 'solana';
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
        particle.auth
            .login({
                preferredAuthType: type,
                account: input_content,
                supportAuthTypes: 'all',
                socialLoginPrompt: 'consent',
                loginFormMode: demoSetting.loginFormMode === 'true',
                hideLoading: type === 'jwt',
            })
            .then((userInfo) => {
                window.localStorage.setItem('isPersonalSign', '0');
                setLoginState(true);
                setLoginLoading(false);
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
    const accountSecurity = () => {
        if (particle) {
            particle.auth
                .accountSecurity()
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
        </div>
    );

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
                                <h2 className="login-box-title">Wallet Infomation</h2>
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
                                            style={{ marginLeft: 4, color: '#1890ff', cursor: 'pointer' }}
                                        />
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
                                        <Button type="primary" className="login-button" onClick={accountSecurity}>
                                            Account Security
                                            <Badge dot={!hasPasswordDot}></Badge>
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
                        <>
                            <h2 className="line-title">
                                <SafetyOutlined /> &nbsp; Transaction
                            </h2>
                            <div className="transaction">
                                <SolanaTransaction
                                    demoSetting={demoSetting}
                                    loginState={loginState}
                                    address={address}
                                    solanaWallet={solanaWallet}
                                ></SolanaTransaction>
                                <SignSolanaTransaction
                                    demoSetting={demoSetting}
                                    loginState={loginState}
                                    address={address}
                                    solanaWallet={solanaWallet}
                                />
                                <SolanaAllTransaction
                                    demoSetting={demoSetting}
                                    loginState={loginState}
                                    address={address}
                                    solanaWallet={solanaWallet}
                                />
                                <h2 className="line-title">
                                    <SafetyOutlined /> &nbsp; Signature
                                </h2>
                                <SolanaSignMessage
                                    demoSetting={demoSetting}
                                    loginState={loginState}
                                    address={address}
                                    solanaWallet={solanaWallet}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="line-title">
                                <SafetyOutlined /> &nbsp; Transaction
                            </h2>
                            <div className="transaction ">
                                <SendETH demoSetting={demoSetting} loginState={loginState} />
                                {!isTron() && (
                                    <>
                                        <SendERC20Approve demoSetting={demoSetting} loginState={loginState} />
                                        <SendERC20Tokens demoSetting={demoSetting} loginState={loginState} />
                                        <SendERC721Tokens demoSetting={demoSetting} loginState={loginState} />
                                        <SendERC1155Tokens demoSetting={demoSetting} loginState={loginState} />
                                        <ContractCall demoSetting={demoSetting} loginState={loginState}></ContractCall>
                                    </>
                                )}
                            </div>
                            <h2 className="line-title">
                                <SafetyOutlined /> &nbsp; Signature
                            </h2>
                            <div className="transaction">
                                <PersonalSign demoSetting={demoSetting} loginState={loginState} />
                                <SignTypedDatav1 demoSetting={demoSetting} loginState={loginState} />
                                <SignTypedDatav3 demoSetting={demoSetting} loginState={loginState} />
                                <SignTypedDatav4 demoSetting={demoSetting} loginState={loginState} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
