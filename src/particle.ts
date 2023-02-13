import { ethers } from 'ethers';
import { ParticleNetwork, UIMode, WalletCustomStyle, WalletEntryPosition } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { EVMProvider } from '@particle-network/local-provider';
import { SolanaWallet } from '@particle-network/solana-wallet';
import Web3 from 'web3';

const customStyle: WalletCustomStyle = {
    // supportAddToken: false, // 是否显示import入口，默认显示
    // supportChains: [
    //   // 可切换链，必须包含chain，如果不包含chain，会默认添加
    //   {
    //     id: 1,
    //     name: "Ethereum",
    //   },
    //   {
    //     id: 5,
    //     name: "Ethereum",
    //   },
    // ],
    // displayTokenAddresses: ["0x326C977E6efc84E512bB9C30f76E30c160eD06FB"], // 显示特定的token，如果不设置，会显示所有的token
    // displayNFTContractAddresses: ["0x4135a7B077871a2DaAA06ae0971FbFb443E866C0"], // 显示特定的NFT合约，如果不设置，会显示所有的NFT合约
    // fiatCoin: "JPY", // 默认显示的法币，如果定义了隐藏setting
    // evmSupportWalletConnect: false, // 是否支持wallet connect
    // supportUIModeSwitch: true, // 是否支持切换dark/light模式
    // supportLanguageSwitch: false, // 是否支持切换语言
    //@ts-ignore
    priorityTokenAddresses: [''],
    //@ts-ignore
    priorityNFTContractAddresses: [''],
    light: {
        colorAccent: '#386ef2', // 高光颜色
        colorPrimary: '#ffffff', // 主要内容背景颜色  例：页面内容背景色
        colorOnPrimary: '#ffffff', // 信息面板背景颜色  例：首页信息块背景色 , switch chain list 背景色
        primaryButtonBackgroundColors: ['#000000', '#000000'], // 主要按钮颜色
        primaryButtonTextColor: '#ffffff', // 主要按钮字体颜色
        primaryIconButtonBackgroundColors: ['#dfe9fd', '#dfe9fd'], // 高光Icon按钮颜色
        cancelButtonBackgroundColor: '#666666', // 取消按钮颜色
        backgroundColors: [
            '#e5e5e5',
            [
                ['#ffffff00', '#ffffff00'],
                ['#ffffff00', '#ffffff00'],
            ],
        ],
        messageColors: ['#7DD5F9', '#ed5d51'], // 消息背景颜色 [0:成功消息, 1:错误消息]
        borderGlowColors: ['#7bd5f940', '#323233'], // 边框发光颜色 [0:亮色, 1:主色,]
        modalMaskBackgroundColor: '#141430b3', // 模态框遮罩层背景颜色
    },
    dark: {
        colorAccent: '#7DD5F9', // 高光颜色  例：dark模式的粉色，
        colorPrimary: '#21213a', // 主要内容背景颜色  例：页面内容背景色
        colorOnPrimary: '#171728', // 信息面板背景颜色  例：首页信息块背景色 , switch chain list 背景色
        primaryButtonBackgroundColors: ['#5ED7FF', '#E89DE7'], // 主要按钮颜色
        primaryIconButtonBackgroundColors: ['#5ED7FF', '#E89DE7'], // 高光Icon按钮颜色
        primaryButtonTextColor: '#0A1161', // 主要按钮字体颜色
        cancelButtonBackgroundColor: '#666666', // 取消按钮颜色
        backgroundColors: [
            '#14152e',
            [
                ['#e6b1f766', '#e6b1f700'],
                ['#7dd5f94d', '#7dd5f900'],
            ],
        ],
        messageColors: ['#7DD5F9', '#ed5d51'], // 消息背景颜色 [0:成功消息, 1:错误消息]
        borderGlowColors: ['#7bd5f940', '#323233'], // 边框发光颜色 [0:亮色, 1:主色,]
        modalMaskBackgroundColor: '#141430b3', // 模态框遮罩层背景颜色
    },
};

const isCustomStyle = !!localStorage.getItem('isCustomStyle');
let promptSettingWhenSign = localStorage.getItem('promptSettingWhenSignValue');
if (promptSettingWhenSign === null) {
    localStorage.setItem('promptSettingWhenSignValue', '1');
    promptSettingWhenSign = '1';
}

const particle = new ParticleNetwork({
    projectId: process.env.REACT_APP_PROJECT_ID as string,
    clientKey: process.env.REACT_APP_CLIENT_KEY as string,
    appId: process.env.REACT_APP_APP_ID as string,
    chainName: 'Ethereum',
    chainId: 1,
    securityAccount: {
        promptSettingWhenSign: Number(promptSettingWhenSign),
    },
    wallet: {
        displayWalletEntry: true,
        preload: true, // preload设置true时，会在登录成功后，用link[rel=preload]的方式加载 Wab Wallet 网站所需要的 css，js资源，此方式不会影响和阻塞页面正常访问
        defaultWalletEntryPosition: WalletEntryPosition.BR,
        customStyle: isCustomStyle ? customStyle : undefined,
        // supportChains: [
        //   {
        //     id: 1,
        //     name: "Ethereum",
        //   },
        //   // {
        //   //   id: 101,
        //   //   name: "Solana",
        //   // },
        // ],
    },
});

let theme = localStorage.getItem('dapp_particle_theme');
if (!theme) {
    theme = 'light';
}
particle.setAuthTheme({
    displayWallet: true,
    uiMode: theme as UIMode,
});

particle.setLanguage(localStorage.getItem('language') || 'en'); // default language: en

//rpcUrl used fot demo internal test, developer can delete it.
//set rpcUrl for internal test
const particleProvider = new ParticleProvider(particle.auth);

//set rpcUrl for internal test
const evmProvider = new EVMProvider(particle.auth);

//set rpcUrl for internal test
const solanaWallet = new SolanaWallet(particle.auth);

window.web3 = new Web3(particleProvider as any);

const ethersProvider = new ethers.providers.Web3Provider(particleProvider, 'any');

// The provider also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
const ethersSigner = ethersProvider.getSigner();

export { particle, particleProvider, evmProvider, ethersProvider, ethersSigner, solanaWallet };
