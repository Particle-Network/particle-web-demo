import './index.scss';
import Web3 from 'web3';
import createWeb3Modal from './web3Modal';
import { useEffect, useMemo, useState } from 'react';
import { Button, Space } from 'antd';
import { ParticleNetwork } from '@particle-network/auth';

const PageWeb3Modal = () => {
    const [web3, setWeb3] = useState<Web3>();

    const particle = useMemo(
        () =>
            new ParticleNetwork({
                projectId: process.env.REACT_APP_PROJECT_ID as string,
                clientKey: process.env.REACT_APP_CLIENT_KEY as string,
                appId: process.env.REACT_APP_APP_ID as string,
                chainName: 'Ethereum',
                chainId: 1,
                wallet: {
                    displayWalletEntry: true,
                },
                securityAccount: {
                    promptSettingWhenSign: 1,
                    promptMasterPasswordSettingWhenLogin: 2,
                },
            }),
        []
    );

    const web3Modal = useMemo(() => createWeb3Modal(particle), [particle]);

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWeb3Modal();
        }
    }, []);

    const [account, setAccount] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);

    const connectWeb3Modal = async () => {
        const provider = await web3Modal.connect();
        if (provider) {
            setWeb3(new Web3(provider));
        }
    };

    useEffect(() => {
        if (web3) {
            requestAccounts();
        }
    }, [web3]);

    const requestAccounts = async () => {
        if (web3) {
            const account = await web3.eth.requestAccounts();
            setAccount(account[0]);
        }
    };

    const disconnect = async () => {
        setLoading(true);
        if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')?.startsWith('"custom-particle') && window.particle) {
            await window.particle.auth.logout(true).catch(() => setLoading(false));
        }
        web3Modal.clearCachedProvider();
        setAccount('');
        setWeb3(undefined);
        setLoading(false);
    };

    return (
        <div className="connect-content">
            <a
                href="https://docs.particle.network/auth-service/sdks/web#evm-web3modal-integration"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-docs"
            >
                Developer Documentation
            </a>

            <Space direction="vertical" align="center">
                {account ? (
                    <Button className="connect-button" type="primary" onClick={disconnect} loading={loading}>
                        Disconnect
                    </Button>
                ) : (
                    <Button type="primary" className="connect-button" onClick={connectWeb3Modal}>
                        Connect With Web3Modal
                    </Button>
                )}
                {account && (
                    <div className="mgt">
                        <div className="mgt">Connect Success:</div>
                        <div className="mgt">{account}</div>
                    </div>
                )}
            </Space>
        </div>
    );
};
export default PageWeb3Modal;
