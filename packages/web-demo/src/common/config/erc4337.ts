const aaOptions = {
    biconomy: [
        {
            chainId: 1,
            version: '1.0.0',
        },
        {
            chainId: 5,
            version: '1.0.0',
        },
        {
            chainId: 137,
            version: '1.0.0',
        },
        {
            chainId: 80001,
            version: '1.0.0',
        },
        {
            chainId: 56,
            version: '1.0.0',
        },
        {
            chainId: 97,
            version: '1.0.0',
        },
        {
            chainId: 42161,
            version: '1.0.0',
        },
        {
            chainId: 42170,
            version: '1.0.0',
        },
        {
            chainId: 421613,
            version: '1.0.0',
        },
        {
            chainId: 10,
            version: '1.0.0',
        },
        {
            chainId: 420,
            version: '1.0.0',
        },
        {
            chainId: 43114,
            version: '1.0.0',
        },
        {
            chainId: 43113,
            version: '1.0.0',
        },
        {
            chainId: 8453,
            version: '1.0.0',
        },
        {
            chainId: 84531,
            version: '1.0.0',
        },
        {
            chainId: 59140,
            version: '1.0.0',
        },
    ],
    cyberConnect: [
        {
            chainId: 10,
            version: '1.0.0',
        },
        {
            chainId: 420,
            version: '1.0.0',
        },
        {
            chainId: 137,
            version: '1.0.0',
        },
        {
            chainId: 80001,
            version: '1.0.0',
        },
        {
            chainId: 8453,
            version: '1.0.0',
        },
        {
            chainId: 84531,
            version: '1.0.0',
        },
        {
            chainId: 59144,
            version: '1.0.0',
        },
        {
            chainId: 59140,
            version: '1.0.0',
        },
        {
            chainId: 42161,
            version: '1.0.0',
        },
        {
            chainId: 421613,
            version: '1.0.0',
        },
        {
            chainId: 204,
            version: '1.0.0',
        },
        {
            chainId: 5611,
            version: '1.0.0',
        },
    ],
    simple: [
        {
            chainId: 1,
            version: '1.0.0',
        },
        {
            chainId: 10,
            version: '1.0.0',
        },
        {
            chainId: 42161,
            version: '1.0.0',
        },
        {
            chainId: 42170,
            version: '1.0.0',
        },
        {
            chainId: 421613,
            version: '1.0.0',
        },
        {
            chainId: 137,
            version: '1.0.0',
        },
        {
            chainId: 80001,
            version: '1.0.0',
        },
        {
            chainId: 5,
            version: '1.0.0',
        },
        {
            chainId: 11155111,
            version: '1.0.0',
        },
        {
            chainId: 56,
            version: '1.0.0',
        },
        {
            chainId: 97,
            version: '1.0.0',
        },
        {
            chainId: 204,
            version: '1.0.0',
        },
        {
            chainId: 5611,
            version: '1.0.0',
        },
        {
            chainId: 534351,
            version: '1.0.0',
        },
        {
            chainId: 91715,
            version: '1.0.0',
        },
        {
            chainId: 59140,
            version: '1.0.0',
        },
        {
            chainId: 420,
            version: '1.0.0',
        },
        {
            chainId: 3441005,
            version: '1.0.0',
        },
        {
            chainId: 169,
            version: '1.0.0',
        },
        {
            chainId: 5001,
            version: '1.0.0',
        },
        {
            chainId: 5000,
            version: '1.0.0',
        },
    ],
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
