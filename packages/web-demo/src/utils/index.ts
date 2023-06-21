export * from './number-utils';
export * from './address';
export * from './type';

export function shortString(str?: string): string {
    if (str) {
        if (str.length <= 10) {
            return str;
        }
        return `${str.slice(0, 5)}...${str.slice(str.length - 5, str.length)}`;
    }
    return '';
}

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
