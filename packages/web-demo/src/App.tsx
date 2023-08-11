import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Page404 from './pages/404';
import PageConnectKit from './pages/connectKit';
import Home from './pages/index';
import PageQrcode from './pages/qrcode';
import PageRainbowKit from './pages/rainbowKit';
import PageWeb3Modal from './pages/web3Modal';
import PageWebRedirect from './pages/webRedirect';

// TODO:set debug for internal test, developer must remove it.
window.__PARTICLE_ENVIRONMENT__ = process.env.REACT_APP_PARTICLE_ENV;
window.__PARTICLE_AUTH_LOCALHOST__ = process.env.REACT_APP_AUTH_LOCALHOST;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rainbowKit" element={<PageRainbowKit />} />
                <Route path="/web3Modal" element={<PageWeb3Modal />} />
                <Route path="/connectKit" element={<PageConnectKit />} />
                <Route path="/qrcode" element={<PageQrcode />} />
                <Route path="/webRedirect" element={<PageWebRedirect />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
