import './App.css';
import { useState } from 'react';
import { chainNames } from './chain-info';
import { particle } from './particle';
import EVMDemo from './evm-demo';
import SolanaDemo from './solana-demo';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select, Slider, Switch } from 'antd';
import { ParticleChains } from '@particle-network/common';
import { SettingOption } from '@particle-network/auth';

function App() {
    const [loginState, setLoginState] = useState(false);
    const [loginFormMode, setLoginFormMode] = useState(!!localStorage.getItem('loginFormMode'));
    const [isCustomStyle, setIsCustomStyle] = useState(!!localStorage.getItem('isCustomStyle'));
    const [promptSettingWhenSign, setPromptSettingWhenSign] = useState<SettingOption>(
        Number(localStorage.getItem('promptSettingWhenSignValue'))
    );
    const [chainKey, setChainKey] = useState<string>('Ethereum');

    const defauleLanguageCode = 'en';
    const languages = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];

    const [language, setLanguage] = useState<string>(localStorage.getItem('language') || defauleLanguageCode);

    useEffect(() => {
        if (particle.auth.isLogin()) {
            particle.switchChain(ParticleChains[chainKey]);
        }
        setLoginState(particle.auth.isLogin());
    }, []);

    const changeChain = async (e) => {
        const key = e.target.value;

        const chain = ParticleChains[key];
        try {
            await particle.auth.switchChain(chain, !!particle.auth.userInfo()?.jwt_id);
            setChainKey(key);
        } catch (error) {
            console.log(error);
        }
    };

    const changeLanguage = (e) => {
        const code = e.target.value;
        particle.setLanguage(code);
        setLanguage(code);
        localStorage.setItem('language', code);
    };

    const onThemeChange = (checked: boolean) => {
        console.log('onThemeChange', checked);
        if (checked) {
            particle.setAuthTheme({ uiMode: 'light' });
            localStorage.setItem('dapp_particle_theme', 'light');
        } else {
            particle.setAuthTheme({ uiMode: 'dark' });
            localStorage.setItem('dapp_particle_theme', 'dark');
        }
    };

    const onLoginFormChange = (checked: boolean) => {
        setLoginFormMode(checked);
        localStorage.setItem('loginFormMode', checked ? 'checked' : '');
    };

    useEffect(() => {
        const classList = document.querySelector('body').classList;
        if (loginFormMode) {
            classList.add('mini-login-form');
        } else {
            classList.remove('mini-login-form');
        }
    }, [loginFormMode]);

    return (
        <div className="App">
            <header className="App-header">
                <a className="App-link" href="https://particle.network" target="_blank" rel="noopener noreferrer">
                    Learn More About Particle Network
                </a>
                <a
                    className="App-link"
                    href="https://static.particle.network/sdks/web/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Particle SDK Browser Sample
                </a>
                <Link className="App-link" to="/web3Modal">
                    Web3Modal Sample
                </Link>

                <Link className="App-link" to="/rainbowkit">
                    RainbowKit Sample
                </Link>

                <Link className="App-link" to="/connect">
                    ConnectKit Sample
                </Link>

                <Switch
                    className="App-theme"
                    checkedChildren="light"
                    unCheckedChildren="dark"
                    onChange={onThemeChange}
                    defaultChecked={localStorage.getItem('dapp_particle_theme') === 'light'}
                />

                <Switch
                    className="Login-mode"
                    checkedChildren="form"
                    unCheckedChildren="full"
                    checked={!!loginFormMode}
                    onChange={onLoginFormChange}
                />
                <div className="custom-style-mode-item">
                    <div className="label">CustomStyle</div>
                    <Switch
                        className="custom-style-mode"
                        checkedChildren="on"
                        unCheckedChildren="off"
                        checked={!!isCustomStyle}
                        onChange={(val) => {
                            setIsCustomStyle(val);
                            localStorage.setItem('isCustomStyle', val ? 'checked' : '');
                            setTimeout(() => {
                                window.location.reload();
                            }, 300);
                        }}
                    />
                </div>

                <div className="prompt-setting-when-sign">
                    <div>Prompt Security Setting When Sign</div>
                    <Select
                        defaultValue={promptSettingWhenSign.toString()}
                        style={{ width: 120 }}
                        onChange={(value) => {
                            setPromptSettingWhenSign(Number(value));
                            localStorage.setItem('promptSettingWhenSignValue', value);
                            setTimeout(() => {
                                window.location.reload();
                            }, 300);
                        }}
                        options={[
                            { value: '0', label: 'None' },
                            { value: '1', label: 'Once' },
                            { value: '2', label: 'Always' },
                        ]}
                    />
                </div>

                <div className="modal-border-radius">
                    Modal border radius
                    <Slider
                        className="slider"
                        defaultValue={10}
                        max={30}
                        min={0}
                        onAfterChange={(value) => {
                            particle.setAuthTheme({
                                modalBorderRadius: value,
                            });
                        }}
                    />
                </div>
            </header>

            <div className="language-code">
                Language:
                <select className="selector-container" defaultValue={language} onChange={changeLanguage}>
                    {languages.map((item) => (
                        <option value={item} key={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div className="chain-config">
                <div className="chain-name">
                    Chain:
                    <select
                        className="selector-container"
                        defaultValue={chainKey}
                        onChange={changeChain}
                        disabled={!loginState}
                    >
                        {Object.keys(ParticleChains).map((item) => (
                            <option value={item} key={item}>
                                {ParticleChains[item].fullname}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {chainKey.includes('Solana') ? (
                <SolanaDemo loginFormMode={loginFormMode} setLoginState={setLoginState} />
            ) : (
                <EVMDemo chainKey={chainKey} loginFormMode={loginFormMode} setLoginState={setLoginState} />
            )}
        </div>
    );
}

export default App;
