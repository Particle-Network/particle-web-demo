import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import './App.scss';
import PageRainbowKit from './pages/rainbowKit';
import PageWeb3Modal from './pages/web3Modal';
import PageConnectKit from './pages/connectKit';
import PageQrcode from './pages/qrcode';
import Page404 from './pages/404';
import React from 'react';
import PageERC4337 from './pages/erc4337';

// TODO:set debug for internal test, developer must remove it.
if (process.env.REACT_APP_PARTICLE_ENV === 'development') {
    window.__PARTICLE_DEVELOPMENT__ = true;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rainbowKit" element={<PageRainbowKit />} />
                <Route path="/web3Modal" element={<PageWeb3Modal />} />
                <Route path="/connectKit" element={<PageConnectKit />} />
                <Route path="/qrcode" element={<PageQrcode />} />
                <Route path="/erc4337" element={<PageERC4337 />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
