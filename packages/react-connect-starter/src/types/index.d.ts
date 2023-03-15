import Web3 from 'web3';

declare global {
    interface Window {
        web3: Web3;
    }
}
