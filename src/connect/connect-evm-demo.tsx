import { Button, message } from 'antd';
import { useAccount, useParticleProvider } from '@particle-network/connect-react-ui';
import './connect-evm-demo.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { isEVMProvider } from '@particle-network/connect';
import { payloadV4 } from '../types/typedData';

export default function EvmDemo(props: any) {
    const account = useAccount();
    const provider = useParticleProvider();
    const [web3, setWeb3] = useState<Web3>(window.web3);

    useEffect(() => {
        if (provider && isEVMProvider(provider)) {
            console.log('set web3');
            setWeb3(new Web3(provider as any));
        }
    }, [provider]);

    const sendTransaction = async () => {
        const txnParams = {
            type: '0x0',
            from: account,
            to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
            value: web3.utils.toWei('0.0001', 'ether'),
            data: '0x',
            gasLimit: 21000,
        };
        web3.eth.sendTransaction(txnParams, (error: any, hash: string) => {
            if (error) {
                if (error.code !== 4011) {
                    message.error(error.message);
                }
                console.log('sendTransaction error', error);
            } else {
                message.success('send tx success: ' + hash);
            }
        });
    };

    const getBalance = async () => {
        const balance = await web3.eth.getBalance(account);
        console.log('getBalance', balance);
        message.success('getBalance: ' + web3.utils.fromWei(balance) + ' ETH');
    };

    const getChainId = async () => {
        const chainId = await web3.eth.getChainId();
        console.log('getChainId', chainId);
        message.success('getChainId: ' + chainId);
    };

    const personalSign = async () => {
        const text = 'Hello Particle Network!';
        web3.eth.personal
            .sign(text, account, '')
            .then((result) => {
                message.success('personalSign: ' + result);
            })
            .catch((error) => {
                message.error('personalSign error: ' + error.message);
            });
    };

    const signTypedData = async () => {
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];

        const params = [from, JSON.stringify(payloadV4)];
        const method = 'eth_signTypedData_v4';

        web3.currentProvider //@ts-ignore
            .request({
                method,
                params,
            })
            .then((result) => {
                console.log('signTypedData_v4 result', result);
                message.success('signTypedData: ' + result);
            })
            .catch((err) => {
                console.log('signTypedData_v4 error', err);
            });
    };

    return (
        <div className="demo-content">
            <Button className="function-item" type="primary" onClick={getBalance}>
                getBalance
            </Button>
            <Button className="function-item" type="primary" onClick={getChainId}>
                getChainId
            </Button>
            <Button className="function-item" type="primary" onClick={personalSign}>
                personalSign
            </Button>
            <Button className="function-item" type="primary" onClick={signTypedData}>
                signTypedData
            </Button>
            <Button className="function-item" type="primary" onClick={sendTransaction}>
                sendTransaction
            </Button>
        </div>
    );
}
