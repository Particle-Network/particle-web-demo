import {
    ArbitrumGoerli,
    ArbitrumNova,
    ArbitrumOne,
    BNBChain,
    BNBChainTestnet,
    BaseGoerli,
    Ethereum,
    EthereumGoerli,
    Optimism,
    OptimismGoerli,
    Polygon,
    PolygonMumbai
} from '@particle-network/chains';

const networkConfig = [
    {
        chainId: Ethereum.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ETHEREUM as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=1&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: EthereumGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_GOERLIAPI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=5&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Polygon.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=137&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: PolygonMumbai.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON_MUMBAI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=80001&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BNBChain.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_MAINNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=56&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BNBChainTestnet.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_TESTNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=97&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumOne.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=42161&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumNova.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_NOVA as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=42170&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=421613&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },

    // {
    //     chainId: PolygonzkEVMTestnet.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON_ZKEVM_TESTNET as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=1442&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
    // {
    //     chainId: PolygonzkEVM.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON_ZKEVM as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=1101&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
    // {
    //     chainId: AvalancheTestnet.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_AVALANCHE_TESTNET as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=43113&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
    // {
    //     chainId: Avalanche.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_AVALANCHE as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=43114&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
    {
        chainId: OptimismGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_OPTIMISM_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=420&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Optimism.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_OPTIMISM as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=10&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BaseGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BASE_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=84531&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    // {
    //     chainId: LineaGoerli.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_LINEA_TESTNET as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=59140&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
];

export default networkConfig;
