import { isValidAddress } from '@ethereumjs/util';

export function isValidSolanaAddress(value: string) {
    const patt = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!value) {
        return false;
    } else {
        return patt.test(value);
    }
}

export function isValidEVMAddress(value: string) {
    return isValidAddress(value);
}

export function isValidTronAddress(value: string) {
    return /^[1-9A-HJ-NP-Za-km-z]{34}$/.test(value);
}
