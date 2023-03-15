import React, { useEffect } from 'react';

import { useAccount, useParticleProvider } from '@particle-network/connect-react-ui';
import './connect-evm-demo.css';
import Web3 from 'web3';
import { isEVMProvider } from '@particle-network/connect';

export default function EvmDemo() {
    const account = useAccount();
    const provider = useParticleProvider();

    // const [signMessageStr, setSignMessageStr] = useState('');

    useEffect(() => {
        if (provider && isEVMProvider(provider)) {
            window.web3 = new Web3(provider as any);
        }
    }, [provider]);

    const sendTransaction = async () => {
        if (account) {
            const txnParams = {
                type: '0x0',
                from: account,
                to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
                value: window.web3.utils.toWei('0.0001', 'ether'),
                data: '0x',
                gasLimit: 21000,
            };
            window.web3.eth.sendTransaction(txnParams, (error: any, hash: string) => {
                if (error) {
                    if (error.code !== 4011) {
                        alert(error.message);
                    }
                    console.log('sendTransaction error', error);
                } else {
                    alert('send tx success: ' + hash);
                }
            });
        }
    };

    const getBalance = async () => {
        if (!account) return;
        const balance = await window.web3.eth.getBalance(account);
        console.log('getBalance', balance);
        alert('getBalance: ' + window.web3.utils.fromWei(balance) + ' ETH');
    };

    const getChainId = async () => {
        const chainId = await window.web3.eth.getChainId();
        console.log('getChainId', chainId);
        alert('getChainId: ' + chainId);
    };

    const personalSign = () => {
        if (!account) return;
        const text = window.web3.utils.utf8ToHex('Hello Particle Network!');
        window.web3.eth.personal
            .sign(text, account, '')
            .then((result) => {
                console.log('personalSign:', result);
                alert('personalSign: ' + result);
                // setSignMessageStr(result);
            })
            .catch((error) => {
                console.log('personalSign error', error);
                alert('personalSign error: ' + error.message);
            });
    };

    return (
        <>
            <div className="demo-content">
                {account}

                <button className="function-item" onClick={getBalance}>
                    getBalance
                </button>

                <button className="function-item" onClick={getChainId}>
                    getChainId
                </button>

                <button className="function-item" onClick={personalSign}>
                    personalSign
                </button>

                <button className="function-item" onClick={sendTransaction}>
                    sendTransaction
                </button>
            </div>
        </>
    );
}
