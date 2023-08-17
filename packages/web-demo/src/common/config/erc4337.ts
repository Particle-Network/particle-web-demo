import {
    ArbitrumGoerli,
    ArbitrumNova,
    ArbitrumOne,
    Avalanche,
    AvalancheTestnet,
    BNBChain,
    BNBChainTestnet,
    Base,
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
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${Ethereum.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: EthereumGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_GOERLIAPI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${EthereumGoerli.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Polygon.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${Polygon.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: PolygonMumbai.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_POLYGON_MUMBAI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${PolygonMumbai.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BNBChain.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_MAINNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${BNBChain.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BNBChainTestnet.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BSC_TESTNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${BNBChainTestnet.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumOne.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${ArbitrumOne.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumNova.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_NOVA as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${ArbitrumNova.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: ArbitrumGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${ArbitrumGoerli.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
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
    {
        chainId: AvalancheTestnet.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_AVALANCHE_TESTNET as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${AvalancheTestnet.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Avalanche.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_AVALANCHE as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${Avalanche.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: OptimismGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_OPTIMISM_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${OptimismGoerli.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Optimism.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_OPTIMISM as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${Optimism.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: Base.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BASE as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${Base.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    {
        chainId: BaseGoerli.id,
        dappAPIKey: process.env.REACT_APP_BICONOMY_BASE_GOERLI as string,
        providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=${BaseGoerli.id}&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    },
    // {
    //     chainId: LineaGoerli.id,
    //     dappAPIKey: process.env.REACT_APP_BICONOMY_LINEA_TESTNET as string,
    //     providerUrl: `${process.env.REACT_APP_RPC_DOMAIN}/evm-chain?chainId=59140&projectUuid=${process.env.REACT_APP_PROJECT_ID}&projectKey=${process.env.REACT_APP_CLIENT_KEY}`,
    // },
];

export default networkConfig;
