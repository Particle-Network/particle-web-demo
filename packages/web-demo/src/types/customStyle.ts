import { WalletCustomStyle } from '@particle-network/auth';
import { BNBChain, BNBChainTestnet, Ethereum, EthereumGoerli } from '@particle-network/chains';

export const customStyle: WalletCustomStyle = {
    supportAddToken: true, // whether to show import token，default true
    supportChains: [
        // whether can switch chains, must be non-empty, otherwise will display all supported chains
        {
            id: Ethereum.id,
            name: Ethereum.name,
        },
        {
            id: EthereumGoerli.id,
            name: EthereumGoerli.name,
        },
        {
            id: BNBChain.id,
            name: BNBChain.name,
        },
        {
            id: BNBChainTestnet.id,
            name: BNBChainTestnet.name,
        },
    ],
    // displayTokenAddresses: ["0x326C977E6efc84E512bB9C30f76E30c160eD06FB"], // whether to show specific token address, if not specified, will display all available tokens
    // displayNFTContractAddresses: ["0x4135a7B077871a2DaAA06ae0971FbFb443E866C0"], // whether to show specific NFT contract address, if not specified, will display all available ones
    // fiatCoin: 'JPY', // display the fiat by default, if specified will hide the setting
    evmSupportWalletConnect: true, // EVM whether support WalletConnect
    supportUIModeSwitch: false, // whether allow switching between dark/light mode
    supportLanguageSwitch: false, // whether support language switching
    priorityTokenAddresses: [''], // tokens that are displayed first
    priorityNFTContractAddresses: [''], // NFT Contract that are displayed first
    light: {
        //light mode style
        colorAccent: '#F23892', // highlight color
        colorPrimary: '#ffffff', // background color for the primary content
        colorOnPrimary: '#ffffff', // background color for the information interface, such as the information block in the home page or component for switching chain
        primaryButtonBackgroundColors: ['#F23892', '#F23892'], // colors for the primary button background
        primaryButtonTextColor: '#ffffff', // color for the primary button text
        primaryIconButtonBackgroundColors: ['#dfe9fd', '#dfe9fd'], // colors for the highlighted icon background
        primaryIconTextColor: '#F23892', // Icon text color
        cancelButtonBackgroundColor: '#666666', // color for the cancel button background
        backgroundColors: [
            // background colors
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
        //dark mode style
        colorAccent: '#7DD5F9',
        colorPrimary: '#21213a',
        colorOnPrimary: '#171728',
        primaryButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
        primaryIconButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
        primaryIconTextColor: '#FFFFFF',
        primaryButtonTextColor: '#0A1161',
        cancelButtonBackgroundColor: '#666666',
        backgroundColors: [
            '#14152e',
            [
                ['#e6b1f766', '#e6b1f700'],
                ['#7dd5f94d', '#7dd5f900'],
            ],
        ],
        messageColors: ['#7DD5F9', '#ed5d51'],
        borderGlowColors: ['#7bd5f940', '#323233'],
        modalMaskBackgroundColor: '#141430b3',
    },
};
