import { ethers } from 'ethers';
import { ParticleNetwork, UIMode, WalletCustomStyle, WalletEntryPosition } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { EVMProvider } from '@particle-network/local-provider';
import { SolanaWallet } from '@particle-network/solana-wallet';
import Web3 from 'web3';

const customStyle: WalletCustomStyle = {
    // supportAddToken: false, // whether to show import token，default true
    // supportChains: [
    //   // whether can switch chains, must be non-empty, otherwise will display all supported chains
    //   {
    //     id: 1,
    //     name: "Ethereum",
    //   },
    //   {
    //     id: 5,
    //     name: "Ethereum",
    //   },
    // ],
    // displayTokenAddresses: ["0x326C977E6efc84E512bB9C30f76E30c160eD06FB"], // whether to show specific token address, if not specified, will display all available tokens
    // displayNFTContractAddresses: ["0x4135a7B077871a2DaAA06ae0971FbFb443E866C0"], // whether to show specific NFT contract address, if not specified, will display all available ones
    // fiatCoin: "JPY", // display the fiat by default, if specified will hide the setting
    // evmSupportWalletConnect: false, // whether support WalletConnect
    // supportUIModeSwitch: true, // whether allow switching between dark/light mode
    // supportLanguageSwitch: false, // whether support language switching
    //@ts-ignore
    priorityTokenAddresses: [''],
    //@ts-ignore
    priorityNFTContractAddresses: [''],
    light: {
        colorAccent: '#386ef2', // highlight color
        colorPrimary: '#ffffff', // background color for the primary content
        colorOnPrimary: '#ffffff', // background color for the information interface, such as the information block in the home page or component for switching chain
        primaryButtonBackgroundColors: ['#000000', '#000000'], //  colors for the primary button background
        primaryButtonTextColor: '#ffffff', // color for the primary button text
        primaryIconButtonBackgroundColors: ['#dfe9fd', '#dfe9fd'], // colors for the highlighted icon background
        cancelButtonBackgroundColor: '#666666', // color for the cancel button background
        backgroundColors: [
            '#e5e5e5',
            [
                ['#ffffff00', '#ffffff00'],
                ['#ffffff00', '#ffffff00'],
            ],
        ],
        messageColors: ['#7DD5F9', '#ed5d51'], // background color for the message background [0: success message, 1: error message]
        borderGlowColors: ['#7bd5f940', '#323233'], // border glow colors [0: highlight, 1: primary]
        modalMaskBackgroundColor: '#141430b3', // background color for the modal mask
    },
    dark: {
        colorAccent: '#7DD5F9', // highlight color
        colorPrimary: '#21213a', // background color for the primary content
        colorOnPrimary: '#171728', // background color for the information interface, such as the information block in the home page or component for switching chain
        primaryButtonBackgroundColors: ['#5ED7FF', '#E89DE7'], //  colors for the primary button background
        primaryIconButtonBackgroundColors: ['#5ED7FF', '#E89DE7'], // colors for the highlighted icon background
        primaryButtonTextColor: '#0A1161', // color for the primary button text
        cancelButtonBackgroundColor: '#666666', // color for the cancel button background
        backgroundColors: [
            '#14152e',
            [
                ['#e6b1f766', '#e6b1f700'],
                ['#7dd5f94d', '#7dd5f900'],
            ],
        ],
        messageColors: ['#7DD5F9', '#ed5d51'], // background color for the message background [0: success message, 1: error message]
        borderGlowColors: ['#7bd5f940', '#323233'], // border glow colors [0: highlight, 1: primary]
        modalMaskBackgroundColor: '#141430b3', // background color for the modal mask
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
        preload: true, // when preload is true, after login, will use link[rel=preload] to load the CSS, JS resources for the Web Wallet, this method will not affect or block page access
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
