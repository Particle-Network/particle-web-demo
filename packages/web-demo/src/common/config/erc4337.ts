const networkConfig = [
    {
        chainId: 1,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ETHEREUM as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=1&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 5,
        dappAPIKey: process.env.REACT_APP_BICONOMY_GOERLIAPI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=5&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 137,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=137&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 80001,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON_MUMBAI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=80001&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 56,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_MAINNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=56&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 97,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_TESTNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=97&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 42161,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=42161&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 42170,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_NOVA as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=42170&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: 421613,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=421613&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
];

export default networkConfig;
