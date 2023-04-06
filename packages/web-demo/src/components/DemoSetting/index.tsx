/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Select, Input, Button, Slider, message, notification, Tooltip, Switch } from 'antd';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ParticleChains as Chains } from '@particle-network/common';
import { UIMode } from '@particle-network/auth';
import { customStyle as defCustomStyle } from '../../types/customStyle';
import PnSelect from '../PnSelect';
import './index.scss';
import { isJson } from '../../utils';

const { TextArea } = Input;
const { Option } = Select;

function DemoSetting(props: any) {
    const { onChange, value: demoSetting, particle, isLogin } = props;

    const keySort = [
        // @ts-ignore
        ...new Set([
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
            'Tron',
            ...Object.keys(Chains),
        ]),
    ];
    const ParticleChains = {};

    keySort.forEach((key) => {
        Object.keys(Chains)
            .filter((key2) => key2.includes(key))
            .forEach((key2) => {
                ParticleChains[key2] = Chains[key2];
            });
    });

    const chainOptions = useMemo(
        () =>
            Object.keys(ParticleChains).map((key) => ({
                ...ParticleChains[key],
                key: key,
            })),
        [keySort]
    );

    const customTextArea = useRef(null);
    // params
    const [chainKey, setChainKey] = useState<string>(demoSetting.chainKey);
    const [modalBorderRadius, setModalBorderRadius] = useState<number>(demoSetting.modalBorderRadius || 10);
    const [language, setLanguage] = useState<string>(demoSetting.language);
    const [loginFormMode, setLoginFormMode] = useState(!!localStorage.getItem('loginFormMode') ? 'true' : 'false');
    const [theme, setTheme] = useState<string>(demoSetting.theme);
    const [walletTheme, setWalletTheme] = useState<string>(demoSetting.walletTheme);
    const [walletEntrance, setWalletEntrance] = useState<boolean>(demoSetting.walletEntrance);

    const [promptSettingWhenSign, setPromptSettingWhenSign] = useState(demoSetting.promptSettingWhenSign);
    const [promptMasterPasswordSettingWhenLogin, setPromptMasterPasswordSettingWhenLogin] = useState<string>(
        demoSetting.promptMasterPasswordSettingWhenLogin
    );
    const [customStyle, setCustomStyle] = useState<string>(demoSetting.customStyle);
    const [textAreaStr, setTextAreaStr] = useState<string>(customStyle);

    // options
    const LanguageOptions = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
    const ThemeOptions = ['light', 'dark'];
    const SettingWhenLoginOption = [
        { value: 0, label: 'None' },
        { value: 1, label: 'Once' },
        { value: 2, label: 'Always' },
    ];

    // callback
    useEffect(() => {
        const newSetting = {
            chainKey,
            language,
            theme,
            loginFormMode,
            modalBorderRadius,
            promptSettingWhenSign,
            promptMasterPasswordSettingWhenLogin,
            customStyle,
            walletTheme,
            walletEntrance,
        };
        if (onChange && JSON.stringify(demoSetting) !== JSON.stringify(newSetting)) {
            onChange({ ...newSetting });
        }
    }, [
        chainKey,
        language,
        theme,
        loginFormMode,
        modalBorderRadius,
        promptSettingWhenSign,
        promptMasterPasswordSettingWhenLogin,
        customStyle,
        walletTheme,
        walletEntrance,
    ]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_theme', theme);
        particle.setAuthTheme({
            uiMode: theme as UIMode,
        });
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_language', language);
        particle.setLanguage(language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_wallettheme', walletTheme);
    }, [walletTheme]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_walletentrance', walletEntrance.toString());
    }, [walletEntrance]);

    const switchChain = async (key) => {
        await particle.switchChain(ParticleChains[key]);
        localStorage.setItem('dapp_particle_chain_key', key);
        console.log('trigger switch chain:', ParticleChains[chainKey]);
        setChainKey(key);
    };

    useEffect(() => {
        localStorage.setItem('dapp_particle_form_mode', loginFormMode ? 'checked' : '');
        // @ts-ignore
        const classList = window.document.querySelector('body').classList;
        if (loginFormMode === 'true') {
            classList.add('mini-login-form');
        } else {
            classList.remove('mini-login-form');
        }
    }, [loginFormMode]);
    useEffect(() => {
        particle.setAuthTheme({
            // @ts-ignore
            modalBorderRadius: Number(modalBorderRadius),
        });
        localStorage.setItem('dapp_particle_modal_border_radius', modalBorderRadius + '');
    }, [modalBorderRadius]);
    return (
        <div className="filter-box card" style={{ flex: 1 }}>
            <h2 className="filter-title">Demo Setting</h2>
            {isLogin && (
                <div className="filter-item">
                    <div className="filter-label">
                        Chain:
                        <InfoCircleOutlined
                            className="info"
                            onClick={() => {
                                window.open('https://docs.particle.network/node-service/evm-chains-api', '_blank');
                            }}
                        />
                    </div>
                    <PnSelect
                        value={chainKey}
                        onChange={switchChain}
                        options={chainOptions.map((item) => ({
                            ...item,
                            label: item.fullname,
                            value: item.key,
                        }))}
                    ></PnSelect>
                </div>
            )}
            <div className="filter-item">
                <div className="filter-label">Language:</div>
                <PnSelect
                    value={language}
                    onChange={setLanguage}
                    options={LanguageOptions.map((item) => ({
                        label: item,
                        value: item,
                    }))}
                ></PnSelect>
            </div>
            <div className="filter-item">
                <div className="filter-label">Auth Theme:</div>
                <PnSelect
                    value={theme}
                    onChange={setTheme}
                    options={ThemeOptions.map((item) => ({
                        label: item,
                        value: item,
                    }))}
                ></PnSelect>
            </div>
            <div className="filter-item">
                <div className="filter-label">
                    Wallet Entrance:{' '}
                    <div style={{ display: 'inline-block' }}>
                        <Switch
                            defaultChecked={walletEntrance}
                            checked={walletEntrance}
                            onChange={setWalletEntrance}
                        ></Switch>
                    </div>
                </div>
            </div>
            {walletEntrance && (
                <div className="filter-item">
                    <div className="filter-label">Wallet Theme:</div>
                    <PnSelect
                        value={walletTheme}
                        onChange={setWalletTheme}
                        options={ThemeOptions.map((item) => ({
                            label: item,
                            value: item,
                        }))}
                    ></PnSelect>
                </div>
            )}

            <div className="filter-item">
                <div className="filter-label">
                    Login Full / Form Mode:
                    <Tooltip placement="topRight" title={'Form Mode only support email and phone login'}>
                        <QuestionCircleOutlined className="text-icon" />
                    </Tooltip>
                </div>

                <PnSelect
                    value={loginFormMode}
                    onChange={setLoginFormMode}
                    options={[
                        { value: 'false', label: 'Full' },
                        { value: 'true', label: 'Form mode' },
                    ]}
                ></PnSelect>
            </div>
            <div className="filter-item">
                <div className="filter-label">Modal Border Radius:</div>
                <Slider
                    className="filter-input"
                    defaultValue={modalBorderRadius}
                    max={30}
                    min={0}
                    onAfterChange={(value) => {
                        setModalBorderRadius(value);
                    }}
                />
            </div>
            <div className="filter-item">
                <div className="filter-label">Prompt Master Password Setting When Login</div>
                <PnSelect
                    value={promptMasterPasswordSettingWhenLogin}
                    onChange={(value) => {
                        localStorage.setItem('promptMasterPasswordSettingWhenLogin', value + '');
                        setPromptMasterPasswordSettingWhenLogin(value);
                    }}
                    options={SettingWhenLoginOption}
                ></PnSelect>
            </div>
            <div className="filter-item">
                <div className="filter-label">Prompt Security Setting When Sign</div>
                <PnSelect
                    value={promptSettingWhenSign}
                    onChange={(value) => {
                        localStorage.setItem('promptSettingWhenSign', value + '');
                        setPromptSettingWhenSign(value);
                    }}
                    options={SettingWhenLoginOption}
                ></PnSelect>
            </div>
            <div className="filter-item">
                <div className="filter-label">
                    Wallet Custom Style:
                    <InfoCircleOutlined
                        className="info"
                        onClick={() => {
                            window.open('https://docs.particle.network/wallet-service/sdks/web', '_blank');
                        }}
                    />
                </div>

                <TextArea
                    ref={customTextArea}
                    rows={10}
                    value={textAreaStr}
                    className="filter-input"
                    // @ts-ignore
                    onInput={(e) => setTextAreaStr(e.target.value)}
                    placeholder="Please input your wallet custom style, use default style if not set"
                    defaultValue={customStyle || JSON.stringify(defCustomStyle)}
                />
                <div className="filter-input">
                    <Button
                        style={{ flex: 1, height: 40 }}
                        type="primary"
                        onClick={() => {
                            if (customTextArea.current) {
                                const text = (customTextArea.current as any).resizableTextArea.textArea.value;
                                try {
                                    if (text && !isJson(text)) {
                                        return notification.error({
                                            // @ts-ignore
                                            message: 'Failed to verify json',
                                        });
                                    }
                                    if (text && text.trim()) {
                                        JSON.parse(text);
                                        localStorage.setItem('customStyle', text);
                                        setTextAreaStr(text);
                                        setCustomStyle(text);
                                    } else {
                                        setCustomStyle(JSON.stringify(defCustomStyle));
                                        setTextAreaStr(JSON.stringify(defCustomStyle));
                                        localStorage.removeItem('customStyle');
                                    }
                                } catch (e) {
                                    message.error('JSON Parse error');
                                }
                            }
                        }}
                    >
                        RUN CUSTOM STYLE
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DemoSetting;
