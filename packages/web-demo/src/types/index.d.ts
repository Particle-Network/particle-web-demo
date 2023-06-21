import type Web3 from 'web3';
import { type SmartAccount } from '@particle-network/biconomy';

declare global {
    interface Window {
        web3: Web3;
        smartAccount: SmartAccount;
    }
}
