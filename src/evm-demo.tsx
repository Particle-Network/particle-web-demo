import './App.css';
import './evm-demo.css';
import { Buffer } from 'buffer';
import { addHexPrefix, bufferToHex, intToHex, toChecksumAddress } from '@ethereumjs/util';
import { recoverPersonalSignature, recoverTypedSignature, SignTypedDataVersion } from '@particle-network/eth-sig-util';
import { useEffect, useState } from 'react';
import { particle } from './particle';
import { fromSunFormat } from './utils/number-utils';
import { message, Card, Input, Button, Checkbox, Modal } from 'antd';
import { AuthType, toBase58Address } from '@particle-network/auth';
import { ParticleChains } from '@particle-network/common';
import { payloadV4 } from './types/typedData';

function EVMDemo(props: any) {
    const { chainKey, loginFormMode, setLoginState } = props;

    const [connect, setConnect] = useState(false);
    const [address, setAddress] = useState('');
    const [personalSignResult, setPersonalSignResult] = useState('');
    const [signTypedDataV1Result, setSignTypedDataV1Result] = useState('');
    const [signTypedDataV3Result, setSignTypedDataV3Result] = useState('');
    const [signTypedDataV4Result, setSignTypedDataV4Result] = useState('');

    const [personalSignRecoveryResult, setPersonalSignRecoveryResult] = useState('');
    const [signTypedDataV1RecoveryResult, setSignTypedDataV1RecoveryResult] = useState('');
    const [signTypedDataV3RecoveryResult, setSignTypedDataV3RecoveryResult] = useState('');
    const [signTypedDataV4RecoveryResult, setSignTypedDataV4RecoveryResult] = useState('');
    const [nativeBalance, setNativeBalance] = useState('0');
    const [loginAccount, setLoginAccount] = useState<string>();

    const [silenceLogout, setSilenceLogout] = useState<boolean>(true);

    const getBalance = async () => {
        const accounts = await window.web3.eth.getAccounts();
        window.web3.eth.getBalance(accounts[0]).then((value) => {
            console.log('EVM getBalance', value, isTron(), chainKey);
            setNativeBalance(isTron() ? fromSunFormat(value) : window.web3.utils.fromWei(value, 'ether'));
        });
    };

    useEffect(() => {
        setConnect(particle.auth.isLogin() && particle.auth.walletExist());
        if (particle.auth.isLogin()) {
            getBalance();
        }

        window.web3.currentProvider.on('chainChanged', (id: string) => {
            console.log('chainChanged', id);
        });

        particle.auth.on('disconnect', () => {
            setConnect(false);
        });
    }, []);

    useEffect(() => {
        if (connect) {
            getBalance();
        }
    }, [chainKey, connect]);

    const connectWallet = (type: AuthType) => {
        let input_content;
        if (type === 'email') {
            const regularExpression =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            input_content =
                loginAccount && regularExpression.test(loginAccount.toLowerCase()) ? loginAccount : undefined;
        } else if (type === 'phone') {
            const regularExpression = /^\+?\d{8,14}$/;
            input_content =
                loginAccount && regularExpression.test(loginAccount.toLowerCase()) ? loginAccount : undefined;
        } else if (type === 'jwt') {
            input_content = loginAccount ? loginAccount.trim() : undefined;
            if (!input_content) {
                message.error('JWT can not empty!');
            } else {
                message.loading('custom loading...');
            }
        }

        particle.auth
            .login({
                preferredAuthType: type,
                account: input_content,
                supportAuthTypes: 'all',
                socialLoginPrompt: 'consent',
                loginFormMode: loginFormMode,
                hideLoading: type === 'jwt',
            })
            .then((userInfo) => {
                setConnect(true);
                getBalance();
                setLoginState(true);
                personalSign();
            })
            .catch((error: any) => {
                console.log('connect wallet', error);
                if (error.code !== 4011) {
                    message.error(error.message);
                }
            });
    };

    const verifyAccount = () => {
        Modal.confirm({
            title: 'Personal Sign',
            onOk: personalSign,
        });
    };

    const logout = () => {
        if (silenceLogout) {
            message.loading('custom logout loading...');
        }

        particle.auth
            .logout(silenceLogout)
            .then(() => {
                console.log('logout success');
                setConnect(false);
                setNativeBalance('');
                setLoginState(false);
            })
            .catch((err) => {
                console.log('logout error', err);
            });
    };

    const getAccounts = () => {
        window.web3.eth.getAccounts((error, accounts) => {
            if (error) throw error;
            console.log(accounts);
            setAddress(accounts[0]);
        });
    };

    const getChainId = () => {
        window.web3.eth.getChainId((error, chainId) => {
            if (error) throw error;
            console.log('chainId', chainId);
        });
    };

    const callContract = async () => {
        const accounts = await window.web3.eth.getAccounts();

        var Contract = require('web3-eth-contract');
        Contract.setProvider(window.web3.currentProvider);

        const abi =
            '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyCoordinatorCanFulfill","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"rarity","type":"uint32"}],"name":"BikeRarity","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint32","name":"rarity","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endId","type":"uint256"}],"name":"MintBikes","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint32","name":"rarity","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endId","type":"uint256"}],"name":"MintMysteryBoxes","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"randomWord","type":"uint256"}],"name":"MysteryBoxOpen","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"address","name":"operator","type":"address"}],"name":"RequestOpenMysteryBox","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bikeRarity","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"boxRarity","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"_subscriptionId","type":"uint64"},{"internalType":"address","name":"_vrfCoordinator","type":"address"},{"internalType":"address","name":"_linkToken","type":"address"},{"internalType":"bytes32","name":"_keyHash","type":"bytes32"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint96","name":"_feeNumerator","type":"uint96"},{"internalType":"uint256","name":"_maxSupply","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint32","name":"rarity","type":"uint32"},{"internalType":"uint256","name":"quantities","type":"uint256"}],"name":"mintBikes","outputs":[{"internalType":"uint256","name":"startId","type":"uint256"},{"internalType":"uint256","name":"endId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint32","name":"rarity","type":"uint32"},{"internalType":"uint256","name":"quantities","type":"uint256"}],"name":"mintMysteryBoxes","outputs":[{"internalType":"uint256","name":"startId","type":"uint256"},{"internalType":"uint256","name":"endId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"redeemNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"revealMysteryBox","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint32","name":"rarity","type":"uint32"}],"name":"setBikeRarity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint96","name":"feeNumerator","type":"uint96"}],"name":"setDefaultRoyalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"timestamp","type":"uint64"}],"name":"setRevealedLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenRedeemFlag","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]';
        var contract = new Contract(JSON.parse(abi), '0xc2bb907a4E45D65DA83416082B0F86366F01b7D8');
        contract.methods.revealMysteryBox(926).send(
            {
                from: accounts[0],
                gas: 23000,
            },
            (error: any, hash) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('contract send success: ' + hash);
                }
            }
        );
    };

    const sendEIP1559Transaction = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const txnParams = {
            from: accounts[0],
            to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
            value: window.web3.utils.toWei('0.001', 'ether'),
            type: '0x2',
            gasLimit: 21000,
        };
        window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
            if (error) {
                if (error.code !== 4011) {
                    message.error(error.message);
                }
            } else {
                message.success('send tx success: ' + hash);
            }
        });
    };

    const sendTransaction = async () => {
        const accounts = await window.web3.eth.getAccounts();
        if (isTron()) {
            const txnParams = {
                from: accounts[0],
                to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
                value: 100000,
            };
            try {
                const result = await window.web3.currentProvider.request({
                    method: 'eth_sendTransaction',
                    params: [txnParams],
                });
                message.success('send tx success: ' + result);
            } catch (error) {
                console.log('sendTransaction', error);
                if (error.code !== 4011) {
                    message.error(error.message);
                }
            }
        } else {
            const txnParams = {
                from: accounts[0],
                to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
                value: window.web3.utils.toWei('0.001', 'ether'),
                type: '0x0',
                gasLimit: 21000,
            };
            // const rep = await ethersSigner.sendTransaction(txnParams);
            window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                console.log('sendTransaction', error, hash);
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('send tx success: ' + hash);
                }
            });
        }
    };

    const sendERC20Transaction = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const method = 'particle_abi_encodeFunctionCall';
        const params = [
            '0xFab46E002BbF0b4509813474841E0716E6730136',
            'erc20_transfer',
            ['0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3', 100000],
        ];

        try {
            //@ts-ignore
            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
            });

            const gasLimit = await window.web3.eth.estimateGas({
                from: from,
                to: '0xFab46E002BbF0b4509813474841E0716E6730136',
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: accounts[0],
                to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
                value: '0x0',
                data: result,
                gasLimit: addHexPrefix(intToHex(gasLimit)),
            };
            window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('sendERC20Transaction success: ' + hash);
                }
            });
        } catch (e) {
            console.log('sendERC20Transaction', e);
            message.error(e.message ?? e);
        }
    };

    const sendERC20Approve = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const method = 'particle_abi_encodeFunctionCall';
        const params = [
            '0xFab46E002BbF0b4509813474841E0716E6730136',
            'erc20_approve',
            ['0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3', 10000000000000],
        ];

        try {
            //@ts-ignore
            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
            });

            const gasLimit = await window.web3.eth.estimateGas({
                from: from,
                to: '0xFab46E002BbF0b4509813474841E0716E6730136',
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: accounts[0],
                to: '0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3',
                value: '0x0',
                data: result,
                gasLimit: addHexPrefix(intToHex(gasLimit)),
            };
            window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('sendERC20Approve success: ' + hash);
                }
            });
        } catch (e) {
            console.log('sendERC20Approve', e);
            message.error(e.message ?? e);
        }
    };

    const sendERC721Transaction = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const method = 'particle_abi_encodeFunctionCall';

        const params = [
            '0xDF27A250c425Ba6721d399bf09259e6a089D6157',
            'erc721_safeTransferFrom',
            [from, '0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8', 1],
        ];

        try {
            //@ts-ignore
            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
            });

            const estimate = await window.web3.eth.estimateGas({
                from: from,
                to: '0xDF27A250c425Ba6721d399bf09259e6a089D6157',
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: from,
                to: '0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8',
                value: '0x0',
                data: result,
                gasLimit: addHexPrefix(intToHex(estimate)),
            };
            window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('sendERC721Transaction success: ' + hash);
                }
            });
        } catch (e) {
            console.log('sendERC721Transaction', e);
            message.error(e.message ?? e);
        }
    };

    const sendERC1155Transaction = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const method = 'particle_abi_encodeFunctionCall';

        const params = [
            '0xcCe924184139a75d312BD8CCE9df55d5f66F08e3',
            'erc1155_safeTransferFrom',
            [from, '0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8', 4, 1, '0x0'],
        ];

        try {
            //@ts-ignore
            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
            });

            const estimate = await window.web3.eth.estimateGas({
                from: from,
                to: '0xcCe924184139a75d312BD8CCE9df55d5f66F08e3',
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: from,
                to: '0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8',
                value: '0x0',
                data: result,
                gasLimit: addHexPrefix(intToHex(estimate)),
            };
            window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    message.success('sendERC1155Transaction success: ' + hash);
                }
            });
        } catch (e) {
            console.log('sendERC1155Transaction', e);
            message.error(e.message ?? e);
        }
    };

    const msgV1 = [
        {
            type: 'string',
            name: 'fullName',
            value: 'John Doe',
        },
        {
            type: 'uint32',
            name: 'userId',
            value: '1234',
        },
    ];
    const signTypedDataV1 = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];

        const params = [JSON.stringify(msgV1), from];
        const method = 'eth_signTypedData_v1';

        window.web3.currentProvider //@ts-ignore
            .request({
                method,
                params,
            })
            .then((result) => {
                console.log('signTypedData result', result);
                setSignTypedDataV1Result(result);
            })
            .catch((err) => {
                console.log('signTypedData error', err);
            });
    };

    const signTypedDataV1Recovery = () => {
        if (!signTypedDataV1Result) {
            return;
        }

        const data = recoverTypedSignature({
            data: msgV1,
            signature: signTypedDataV1Result,
            version: SignTypedDataVersion.V1,
        });
        setSignTypedDataV1RecoveryResult(toChecksumAddress(data));
    };

    const payloadV3 = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Person: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
            ],
            Mail: [
                { name: 'from', type: 'Person' },
                { name: 'to', type: 'Person' },
                { name: 'contents', type: 'string' },
            ],
        },
        primaryType: 'Mail',
        domain: {
            name: 'Ether Mail',
            version: '1',
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
                name: 'Bob',
                wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'Hello, Bob!',
        },
    };

    const signTypedDataV3 = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const params = [from, JSON.stringify(payloadV3)];
        const method = 'eth_signTypedData_v3';

        window.web3.currentProvider //@ts-ignore
            .request({
                method,
                params,
            })
            .then((result) => {
                console.log('signTypedData_v3 result', result);
                setSignTypedDataV3Result(result);
            })
            .catch((err) => {
                console.log('signTypedData_v3 error', err);
            });
    };

    const signTypedDataV3Recovery = () => {
        if (!signTypedDataV3Result) {
            return;
        }
        const data = recoverTypedSignature({
            data: payloadV3 as any,
            signature: signTypedDataV3Result,
            version: SignTypedDataVersion.V3,
        });
        setSignTypedDataV3RecoveryResult(toChecksumAddress(data));
    };

    const signTypedDataV4 = async () => {
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];

        const params = [from, JSON.stringify(payloadV4)];
        const method = 'eth_signTypedData_v4';

        //EIP712Domain and domain order: name, version, chainId, verifyingContract

        window.web3.currentProvider //@ts-ignore
            .request({
                method,
                params,
            })
            .then((result) => {
                console.log('signTypedData_v4 result', result);
                setSignTypedDataV4Result(result);
            })
            .catch((err) => {
                console.log('signTypedData_v4 error', err);
            });
    };

    const signTypedDataV4Recovery = () => {
        if (!signTypedDataV4Result) {
            return;
        }

        const data = recoverTypedSignature({
            data: payloadV4 as any,
            signature: signTypedDataV4Result,
            version: SignTypedDataVersion.V4,
        });
        setSignTypedDataV4RecoveryResult(toChecksumAddress(data));
    };

    const personalSignMessage =
        'Hello Particle Network!💰💰💰 \n\nThe fastest path from ideas to deployment in a single workflow for high performance dApps. \n\nhttps://particle.network';
    const personalSign = async () => {
        // Personal Sign

        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const msg = bufferToHex(Buffer.from(personalSignMessage, 'utf8'));
        const params = [msg, from];
        const method = 'personal_sign';

        window.web3.currentProvider //@ts-ignore
            .request({
                method,
                params,
            })
            .then((result) => {
                console.log('personal_sign', result);
                setPersonalSignResult(result);
            })
            .catch((error) => {
                console.error('personal_sign', error);
            });
    };

    const personalSignRecovery = () => {
        if (!personalSignResult) {
            return;
        }

        const data = recoverPersonalSignature({
            data: personalSignMessage,
            signature: personalSignResult,
        });
        setPersonalSignRecoveryResult(toChecksumAddress(data));
    };

    const onLoginAccountChange = (e) => {
        setLoginAccount(e.target.value);
    };

    const openBuy = () => {
        particle.openBuy();
    };

    const isTron = () => {
        return ParticleChains[chainKey].name === 'Tron';
    };

    const isSupportEIP1559 = () => {
        return ParticleChains[chainKey].supportEIP1559;
    };

    return (
        <div>
            <div className="native-balance">
                Balance: {nativeBalance} {ParticleChains[chainKey].nativeCurrency.symbol}
                {connect && (
                    <Button style={{ marginLeft: '20px' }} type="primary" onClick={openBuy}>
                        Buy
                    </Button>
                )}
                {connect && (
                    <Button
                        style={{ marginLeft: '20px' }}
                        type="primary"
                        onClick={() => particle.auth.accountSecurity()}
                    >
                        AccountSecurity
                    </Button>
                )}
                {connect && (
                    <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => particle.walletEntryDestroy()}>
                        WalletEntryDestory
                    </Button>
                )}
                {connect && (
                    <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => particle.walletEntryCreate()}>
                        WalletEntryCreate
                    </Button>
                )}
            </div>

            <div className="body-content">
                <div className="card-zero">
                    <div className="title">Basic Actions</div>
                    <div>
                        <Card title={connect ? '' : 'CONNECT TO WALLET'} style={{ width: '100%' }}>
                            {connect ? (
                                <div style={{ fontWeight: '700', fontSize: '16px' }}>CONNECTED</div>
                            ) : (
                                <>
                                    <button
                                        className="blue-btn"
                                        onClick={() => connectWallet('email')}
                                        disabled={connect}
                                    >
                                        CONNECT
                                    </button>
                                    <Input
                                        placeholder="optional: login account (email/E.164 phone/JWT)"
                                        className="input_text mgt"
                                        onChange={onLoginAccountChange}
                                    />
                                    <div className="change-social">
                                        <img
                                            src={require(`./common/images/email_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('email')}
                                        />

                                        <img
                                            src={require(`./common/images/phone_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('phone')}
                                        />

                                        <img
                                            src={require(`./common/images/google_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('google')}
                                        />

                                        <img
                                            src={require(`./common/images/github_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('github')}
                                        />

                                        <img
                                            src={require(`./common/images/apple_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('apple')}
                                        />

                                        <img
                                            src={require(`./common/images/jwt_icon.png`)}
                                            alt=""
                                            onClick={() => connectWallet('jwt')}
                                        />
                                    </div>
                                </>
                            )}
                        </Card>
                        {connect && (
                            <div className="logout-content mgt">
                                <button className="blue-btn logout-btn" onClick={logout} disabled={!connect}>
                                    DISCONNECT
                                </button>
                                <Checkbox
                                    className="silence_logout"
                                    checked={silenceLogout}
                                    onChange={(e) => setSilenceLogout(e.target.checked)}
                                >
                                    SilenceLogout
                                </Checkbox>
                            </div>
                        )}
                    </div>
                    <div>
                        <button className="blue-btn" onClick={getAccounts}>
                            ETH_ACCOUNTS
                        </button>
                    </div>
                    <div className="content">eth_accounts result: {isTron() ? toBase58Address(address) : address}</div>
                </div>

                <div className="card-zero">
                    <div className="title">Send {ParticleChains[chainKey].nativeCurrency.symbol}</div>
                    <div>
                        <button className="blue-btn" onClick={sendTransaction} disabled={!connect}>
                            SEND TRANSACTION
                        </button>
                        {isSupportEIP1559() && (
                            <button className="blue-btn mgt" onClick={sendEIP1559Transaction} disabled={!connect}>
                                SEND EIP1559 TRANSACTION
                            </button>
                        )}
                    </div>
                </div>

                {!isTron() && (
                    <div className="card-zero">
                        <div className="title">Send Tokens</div>
                        <div>
                            <button className="blue-btn" onClick={sendERC20Transaction} disabled={!connect}>
                                TRANSFER ERC 20 TOKENS
                            </button>
                            <button className="blue-btn mgt" onClick={sendERC20Approve} disabled={!connect}>
                                ERC 20 APPROVE
                            </button>
                            <button className="blue-btn mgt" onClick={sendERC721Transaction} disabled={!connect}>
                                TRANSFER ERC 721 TOKENS
                            </button>
                            <button className="blue-btn mgt" onClick={sendERC1155Transaction} disabled={!connect}>
                                TRANSFER ERC 1155 TOKENS
                            </button>
                            <button className="blue-btn mgt" onClick={callContract} disabled={!connect}>
                                Contract Call
                            </button>
                        </div>
                    </div>
                )}

                <div className="card-zero">
                    <div className="title">Personal Sign</div>
                    <div>
                        <button className="blue-btn" onClick={personalSign} disabled={!connect}>
                            SIGN
                        </button>
                    </div>
                    <div className="sign">Result: {personalSignResult}</div>
                    <div>
                        <button className="blue-btn" onClick={personalSignRecovery}>
                            VERIFY
                        </button>
                    </div>
                    <div className="sign">recovery result: {personalSignRecoveryResult}</div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Typed Data (V1)</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV1} disabled={!connect}>
                            SIGN
                        </button>
                    </div>
                    <div className="sign">Result: {signTypedDataV1Result}</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV1Recovery}>
                            VERIFY
                        </button>
                    </div>
                    <div className="sign">Recovery result: {signTypedDataV1RecoveryResult}</div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Typed Data V3</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV3} disabled={!connect}>
                            SIGN
                        </button>
                    </div>
                    <div className="sign">Result: {signTypedDataV3Result}</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV3Recovery}>
                            VERIFY
                        </button>
                    </div>
                    <div className="sign">Recovery result: {signTypedDataV3RecoveryResult}</div>
                </div>

                <div className="card-zero">
                    <div className="title">Sign Typed Data V4</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV4} disabled={!connect}>
                            SIGN
                        </button>
                    </div>
                    <div className="sign">Result: {signTypedDataV4Result}</div>
                    <div>
                        <button className="blue-btn" onClick={signTypedDataV4Recovery}>
                            VERIFY
                        </button>
                    </div>
                    <div className="sign">Recovery result: {signTypedDataV4RecoveryResult}</div>
                </div>
            </div>
        </div>
    );
}

export default EVMDemo;
