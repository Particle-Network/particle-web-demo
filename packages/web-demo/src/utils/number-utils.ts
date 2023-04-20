import { BigNumber } from 'bignumber.js';
import { isHexString } from '@particle-network/auth';
import numbro from 'numbro';

export function fromSunFormat(amount: string, mantissa = 6): string {
    const bn = new BigNumber(amount, isHexString(amount) ? 16 : 10);
    const value = bn.div(new BigNumber(1000_000)).toString(10);
    return numbro(value).format({
        thousandSeparated: true,
        trimMantissa: true,
        mantissa: mantissa,
    });
}

export type EthereumUnit = 'wei' | 'gwei' | 'ether' | 'mwei';

const unitMap = {
    wei: '1',
    mwei: '1000000',
    gwei: '1000000000',
    ether: '1000000000000000000',
};

export const DecimalUnitMap = {
    1: 'wei',
    6: 'mwei',
    9: 'gwei',
    18: 'ether',
};

export function fromWei(amount: string | number | BigNumber, unit: EthereumUnit = 'ether'): string {
    const bn = toBigNumber(amount);
    const value = bn.div(new BigNumber(unitMap[unit]));
    return value.toString();
}

export function toWei(amount: string | number | BigNumber, unit: EthereumUnit = 'ether'): string {
    const bn = toBigNumber(amount);
    const value = bn.multipliedBy(new BigNumber(unitMap[unit]));
    return value.toString();
}

export function toBigNumber(value: string | number | BigNumber) {
    let bn: BigNumber;
    if (typeof value === 'string') {
        bn = new BigNumber(value, isHexString(value) ? 16 : 10);
    } else {
        bn = new BigNumber(value);
    }
    return bn;
}
