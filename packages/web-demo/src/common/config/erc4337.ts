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
    PolygonMumbai,
} from '@particle-network/chains';

// SIMPLE:[137, 80001, 5, 11155111, 56, 97, 204, 5611, 534351, 91715, 59140, 420, 3441005, 169, 5001, 5000]
// CYBERCONNECT:[10, 420, 137, 80001, 8453, 84531, 59144, 59140, 42161, 421613, 204, 5611, 56, 97]
const aaOptions = {
    biconomy: [
        {
            chainId: Ethereum.id,
            apiKey: process.env.REACT_APP_BICONOMY_ETHEREUM as string,
            version: '1.0.0',
        },
        {
            chainId: EthereumGoerli.id,
            apiKey: process.env.REACT_APP_BICONOMY_GOERLIAPI as string,
            version: '1.0.0',
        },
        {
            chainId: Polygon.id,
            apiKey: process.env.REACT_APP_BICONOMY_POLYGON as string,
            version: '1.0.0',
        },
        {
            chainId: PolygonMumbai.id,
            apiKey: process.env.REACT_APP_BICONOMY_POLYGON_MUMBAI as string,
            version: '1.0.0',
        },
        {
            chainId: BNBChain.id,
            apiKey: process.env.REACT_APP_BICONOMY_BSC_MAINNET as string,
            version: '1.0.0',
        },
        {
            chainId: BNBChainTestnet.id,
            apiKey: process.env.REACT_APP_BICONOMY_BSC_TESTNET as string,
            version: '1.0.0',
        },
        {
            chainId: ArbitrumOne.id,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE as string,
            version: '1.0.0',
        },
        {
            chainId: ArbitrumNova.id,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_NOVA as string,
            version: '1.0.0',
        },
        {
            chainId: ArbitrumGoerli.id,
            apiKey: process.env.REACT_APP_BICONOMY_ARBITRUM_ONE_GOERLI as string,
            version: '1.0.0',
        },

        // {
        //     chainId: PolygonzkEVMTestnet.id,
        //     apiKey: process.env.REACT_APP_BICONOMY_POLYGON_ZKEVM_TESTNET as string,
        // },
        // {
        //     chainId: PolygonzkEVM.id,
        //     apiKey: process.env.REACT_APP_BICONOMY_POLYGON_ZKEVM as string,
        // },
        {
            chainId: AvalancheTestnet.id,
            apiKey: process.env.REACT_APP_BICONOMY_AVALANCHE_TESTNET as string,
            version: '1.0.0',
        },
        {
            chainId: Avalanche.id,
            apiKey: process.env.REACT_APP_BICONOMY_AVALANCHE as string,
            version: '1.0.0',
        },
        {
            chainId: OptimismGoerli.id,
            apiKey: process.env.REACT_APP_BICONOMY_OPTIMISM_GOERLI as string,
            version: '1.0.0',
        },
        {
            chainId: Optimism.id,
            apiKey: process.env.REACT_APP_BICONOMY_OPTIMISM as string,
            version: '1.0.0',
        },
        {
            chainId: Base.id,
            apiKey: process.env.REACT_APP_BICONOMY_BASE as string,
            version: '1.0.0',
        },
        {
            chainId: BaseGoerli.id,
            apiKey: process.env.REACT_APP_BICONOMY_BASE_GOERLI as string,
            version: '1.0.0',
        },
        // {
        //     chainId: LineaGoerli.id,
        //     apiKey: process.env.REACT_APP_BICONOMY_LINEA_TESTNET as string,
        // },
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
        {
            chainId: 56,
            version: '1.0.0',
        },
        {
            chainId: 97,
            version: '1.0.0',
        },
    ],
    simple: [
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
};

export default aaOptions;
