import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './particle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3ModalDemo from './web3Modal-demo';
import ConnectDemo from './connect/ConnectDemo';
import RainbowKitDemo from './rainbowkit/rainbowkit-demo';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/web3Modal" element={<Web3ModalDemo />}></Route>
                <Route path="/connect" element={<ConnectDemo />}></Route>
                <Route path="/rainbowkit" element={<RainbowKitDemo />}></Route>
                <Route path="/" element={<App />}></Route>
            </Routes>
        </Router>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
