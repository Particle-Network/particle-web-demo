import React, { useCallback, useMemo, useState, useEffect } from 'react';
import './index.scss';
function PageQrCode() {
    const isIos = useMemo(() => {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android终端
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isAndroid) {
            return false;
        }
        if (isIOS) {
            return true;
        }
    }, []);

    const open = () => {
        if (isIos) {
            window.location.href = 'https://apps.apple.com/us/app/particle-crypto-wallet/id1632425771x';
        } else {
            window.location.href = 'https://play.google.com/store/apps/details?id=network.particle.auth';
        }
    };

    useEffect(() => {
        open();
    }, []);
    return (
        <div className="qrcode center-center" onClick={open}>
            click open store!
        </div>
    );
}

export default PageQrCode;
