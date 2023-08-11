import { type SmartAccount } from '@particle-network/aa';
import type Web3 from 'web3';

declare global {
    interface Window {
        web3: Web3;
        smartAccount: SmartAccount;
    }
}
