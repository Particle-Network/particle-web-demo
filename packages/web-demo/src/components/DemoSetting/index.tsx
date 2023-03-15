/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Select, Input, Button, Slider, message, notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ParticleChains as Chains } from '@particle-network/common';
import { UIMode } from '@particle-network/auth';
import { customStyle as defCustomStyle } from '../../types/customStyle';

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
    const [loginFormMode, setLoginFormMode] = useState(!!localStorage.getItem('loginFormMode'));
    const [theme, setTheme] = useState<string>(demoSetting.theme);

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
            customStyle,
            promptMasterPasswordSettingWhenLogin,
            promptSettingWhenSign,
            loginFormMode,
            modalBorderRadius,
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
    ]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_theme', theme);
        particle.setAuthTheme({
            displayWallet: true,
            uiMode: theme as UIMode,
        });
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('dapp_particle_language', language);
        particle.setLanguage(language);
    }, [language]);

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
        if (loginFormMode) {
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
        console.log('change modal border radius');
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
                    <Select
                        listItemHeight={10}
                        listHeight={250}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        className="filter-input"
                        defaultValue={chainKey}
                        value={chainKey}
                        onChange={switchChain}
                        onPopupScroll={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {/* {ParticleChains.map((chainKey) => (
                            <Option key={chainKey} value={chainKey} label={ParticleChains[chainKey].fullname}>
                                <div className="chain-option">
                                    <img src={ParticleChains[chainKey].icon} alt="" className="chain-icon" />
                                    <span>{ParticleChains[chainKey].fullname}</span>
                                    <div>{ParticleChains[chainKey].id}</div>
                                </div>
                            </Option>
                        ))} */}

                        {chainOptions.map((chain) => (
                            <Option key={chain.key} value={chain.key} label={chain.fullname}>
                                <div className="chain-option">
                                    <img src={chain.icon} alt="" className="chain-icon" />
                                    <span>{chain.fullname}</span>
                                    <div>{chain.id}</div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </div>
            )}
            <div className="filter-item">
                <div className="filter-label">Language:</div>
                <Select
                    className="filter-input"
                    defaultValue={language}
                    onChange={setLanguage}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                    {LanguageOptions.map((lang, langIdx) => (
                        <Option key={langIdx} value={lang}>
                            {lang}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="filter-item">
                <div className="filter-label">Theme:</div>
                <Select
                    className="filter-input"
                    value={theme}
                    onChange={setTheme}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                    {ThemeOptions.map((theme, idx) => (
                        <Option key={idx} value={theme} label={theme}>
                            {theme}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="filter-item">
                <div className="filter-label">Full / Form Mode:</div>
                <Select
                    className="filter-input"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    defaultValue={loginFormMode}
                    value={loginFormMode}
                    onChange={setLoginFormMode}
                    options={[
                        { value: false, label: 'Full' },
                        { value: true, label: 'Form mode' },
                    ]}
                />
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
                <Select
                    className="filter-input"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={promptMasterPasswordSettingWhenLogin}
                    onChange={(value) => {
                        localStorage.setItem('promptMasterPasswordSettingWhenLogin', value + '');
                        setPromptMasterPasswordSettingWhenLogin(value);
                    }}
                    options={SettingWhenLoginOption}
                />
            </div>
            <div className="filter-item">
                <div className="filter-label">Prompt Security Setting When Sign</div>
                <Select
                    className="filter-input"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={promptSettingWhenSign}
                    onChange={(value) => {
                        localStorage.setItem('promptSettingWhenSign', value + '');
                        setPromptSettingWhenSign(value);
                    }}
                    options={SettingWhenLoginOption}
                />
            </div>{' '}
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
                                        localStorage.setItem('customStyle', JSON.stringify(defCustomStyle));
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
