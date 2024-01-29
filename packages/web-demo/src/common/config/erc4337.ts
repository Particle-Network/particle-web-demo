export const options = {
    BICONOMY_V1: {
        NAME: 'BiconomyV1 Account',
        SUPPORTED_CHAIN_IDS: [
            1, 5, 137, 80001, 56, 97, 42161, 42170, 421613, 10, 420, 43114, 43113, 8453, 84531, 1101, 1442, 59140,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    BICONOMY_V2: {
        NAME: 'Biconomy Account',
        SUPPORTED_CHAIN_IDS: [
            1, 5, 11155111, 137, 80001, 56, 97, 42161, 42170, 421613, 421614, 10, 420, 43114, 43113, 8453, 84531, 1101,
            1442, 59144, 59140, 204, 5611, 5000, 5001, 169, 3441005, 9980, 91715, 1284, 534351, 168587773,
        ],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    SIMPLE: {
        NAME: 'Simple Account',
        SUPPORTED_CHAIN_IDS: [
            1, 5, 11155111, 17000, 137, 80001, 56, 97, 204, 5611, 42161, 42170, 421613, 421614, 43114, 43113, 8453,
            84531, 84532, 59144, 59140, 10, 420, 11155420, 169, 3441005, 5000, 5001, 534352, 534351, 100, 10200, 424,
            58008, 88, 89, 1284, 1285, 1287, 1101, 1442, 250, 4002, 9980, 91715, 42766, 43851, 167007, 167008, 195,
            1261120, 12008, 12015, 7001, 28122024, 168587773, 80085,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    CYBERCONNECT: {
        NAME: 'Cyber Account',
        SUPPORTED_CHAIN_IDS: [
            1, 11155111, 56, 97, 10, 420, 137, 80001, 8453, 84531, 59144, 59140, 42161, 421613, 204, 5611, 534352,
            534351,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    LIGHT: {
        NAME: 'Alchemy Account',
        SUPPORTED_CHAIN_IDS: [1, 11155111, 10, 420, 137, 80001, 8453, 84531, 42161, 421613],
        BATCH_TX: true,
        VERSION: '1.0.2',
    },
};

const aaOptions = {
    accountContracts: {
        BICONOMY: [
            {
                version: options.BICONOMY_V1.VERSION,
                chainIds: options.BICONOMY_V1.SUPPORTED_CHAIN_IDS,
            },
            {
                version: options.BICONOMY_V2.VERSION,
                chainIds: options.BICONOMY_V2.SUPPORTED_CHAIN_IDS,
            },
        ],
        CYBERCONNECT: [
            {
                version: options.CYBERCONNECT.VERSION,
                chainIds: options.CYBERCONNECT.SUPPORTED_CHAIN_IDS,
            },
        ],
        SIMPLE: [
            {
                version: options.SIMPLE.VERSION,
                chainIds: options.SIMPLE.SUPPORTED_CHAIN_IDS,
            },
        ],
        LIGHT: [
            {
                version: options.LIGHT.VERSION,
                chainIds: options.LIGHT.SUPPORTED_CHAIN_IDS,
            },
        ],
    },
    paymasterApiKeys: [
        {
            chainId: 1,
            apiKey: process.env.REACT_APP_BICONOMY_ETHEREUM as string,
        },
        {
            chainId: 5,
            apiKey: process.env.REACT_APP_BICONOMY_GOERLIAPI as string,
        },
        {
            chainId: 137,
            apiKey: process.env.REACT_APP_BICONOMY_POLYGON as string,
        },
        {
            chainId: 80001,
            apiKey: process.env.REACT_APP_BICONOMY_POLYGON_MUMBAI as string,
        },
        {
            chainId: 56,
            apiKey: process.env.REACT_APP_BICONOMY_BSC_MAINNET as string,
        },
        {
            chainId: 97,
            apiKey: process.env.REACT_APP_BICONOMY_BSC_TESTNET as string,
        },
        {
            chainId: 42161,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE as string,
        },
        {
            chainId: 42170,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_NOVA as string,
        },
        {
            chainId: 421613,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE_GOERLI as string,
        },
        {
            chainId: 10,
            apiKey: process.env.REACT_APP_BICONOMY_OPTIMISM as string,
        },
        {
            chainId: 420,
            apiKey: process.env.REACT_APP_BICONOMY_OPTIMISM_GOERLI as string,
        },
        {
            chainId: 43114,
            apiKey: process.env.REACT_APP_BICONOMY_AVALANCHE as string,
        },
        {
            chainId: 43113,
            apiKey: process.env.REACT_APP_BICONOMY_AVALANCHE_TESTNET as string,
        },
        {
            chainId: 8453,
            apiKey: process.env.REACT_APP_BICONOMY_BASE as string,
        },
        {
            chainId: 84531,
            apiKey: process.env.REACT_APP_BICONOMY_BASE_GOERLI as string,
        },
        {
            chainId: 59140,
            apiKey: process.env.REACT_APP_BICONOMY_LINEA_TESTNET as string,
        },
    ],
};

export default aaOptions;
