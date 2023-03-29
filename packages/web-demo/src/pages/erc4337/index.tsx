import './index.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ParticleNetwork } from '@particle-network/auth';
import { Button, Card, Input, message, Modal, notification, Select, Space, Spin } from 'antd';
import { LinkOutlined, RedoOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { ParticleProvider } from '@particle-network/provider';
import { ChainId, FeeQuote, Transaction } from '@biconomy/core-types';
import { BalancesDto, IBalances } from '@biconomy/node-client';
import SmartAccount from '@biconomy/smart-account';
import { ethers } from 'ethers';
import { chains } from '@particle-network/common';
import { DecimalUnitMap, fromWei, shortString } from '../../utils';

const PageERC4337 = () => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
    const [account, setAccount] = useState<string>();
    const [smartAccount, setSmartAccount] = useState<SmartAccount>();

    const nativeRef = useRef<any[]>([]);
    const erc20Ref = useRef<any[]>([]);
    const erc721Ref = useRef<any[]>([]);
    const erc1155Ref = useRef<any[]>([]);

    const [switchChainLoading, setSwitchChainLoading] = useState(false);
    const [openPaymentOptions, setOpenPaymentOptions] = useState<{
        open: boolean;
        transaction?: Transaction;
    }>({
        open: false,
    });
    const [feeQuotes, setFeeQuotes] = useState<FeeQuote[]>();

    const [sendLoading, setSendLoading] = useState(false);

    const [eoaBalance, setEoaBalance] = useState('0');
    const [scaBalance, setScaBalance] = useState<IBalances[]>([]);

    const [eoaBalanceLoading, setEoaBalanceLoading] = useState(false);
    const [scaBalanceLoading, setScaBalanceLoading] = useState(false);

    const [walletDeploy, setWalletDeploy] = useState<boolean>();
    const [deployLoading, setDeployLoading] = useState<boolean>(false);

    const resetConnectState = () => {
        setAccount(undefined);
        setSmartAccount(undefined);
        setSwitchChainLoading(false);
        setOpenPaymentOptions({ open: false });
        setFeeQuotes([]);
        setSendLoading(false);
        setEoaBalance('0');
        setScaBalance([]);
        setEoaBalanceLoading(false);
        setScaBalanceLoading(false);
        setWalletDeploy(undefined);
        setDeployLoading(false);
    };

    const particle = useMemo(() => {
        const pn = new ParticleNetwork({
            projectId: process.env.REACT_APP_PROJECT_ID as string,
            clientKey: process.env.REACT_APP_CLIENT_KEY as string,
            appId: process.env.REACT_APP_APP_ID as string,
            chainId: 5,
            chainName: 'Ethereum',
        });
        return pn;
    }, []);

    useEffect(() => {
        if (particle) {
            const provider = new ethers.providers.Web3Provider(new ParticleProvider(particle.auth), 'any');
            setProvider(provider);
            if (particle.auth.isLogin()) {
                setAccount(particle.auth.wallet()?.public_address);
            }
            particle.auth.on('disconnect', resetConnectState);
        }
    }, [particle]);

    useEffect(() => {
        if (particle && account) {
            getEOABalance();
            initSmartAccount();
        }
    }, [particle, account]);

    useEffect(() => {
        if (smartAccount) {
            getSCABalance();
            checkWalletIsDeploy();
        }
    }, [smartAccount]);

    const initSmartAccount = async () => {
        if (provider && account) {
            // Initialize the Smart Account
            // All values are optional except networkConfig only in the case of gasless dappAPIKey is required
            const options = {
                activeNetworkId: ChainId.GOERLI,
                supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MUMBAI, ChainId.BSC_TESTNET],
                networkConfig: [
                    {
                        chainId: ChainId.GOERLI,
                        // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                        // Meanwhile you can use the test dapp api key mentioned above
                        dappAPIKey: 'gUv-7Xh-M.aa270a76-a1aa-4e79-bab5-8d857161c561',
                        // providerUrl: '',
                    },
                    {
                        chainId: ChainId.POLYGON_MUMBAI,
                        // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                        // Meanwhile you can use the test dapp api key mentioned above
                        dappAPIKey: '59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3',
                        // providerUrl: '',
                    },
                    {
                        chainId: ChainId.BSC_TESTNET,
                        // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                        // Meanwhile you can use the test dapp api key mentioned above
                        dappAPIKey: 'xIogoMZ7n.65cb71d2-afbe-4792-b68f-f653bd65765b',
                        // providerUrl: '',
                    },
                ],
            };
            // this provider is from the social login which we created in last setup
            const smartAccount = new SmartAccount(provider, options);
            await smartAccount?.init();
            smartAccount.on('txHashGenerated', (response: any) => {
                console.log('txHashGenerated event received via emitter', response);
                notification.success({
                    message: 'Transaction sent',
                    description: response.hash,
                });
            });

            smartAccount.on('txMined', (response: any) => {
                console.log('txMined event received via emitter', response);
                notification.success({
                    message: 'Transaction mined',
                    description: response.hash,
                });
            });

            smartAccount.on('error', (response: any) => {
                console.log('', response);
                notification.error({
                    message: response?.msg || 'Smart Account Error',
                    description: 'error event received via emitter',
                });
            });

            setSmartAccount(smartAccount);
        }
    };

    const checkWalletIsDeploy = async () => {
        if (provider && smartAccount) {
            const deployed = await smartAccount.isDeployed(particle.auth.chainId());
            console.log('checkWalletIsDeploy', deployed);
            setWalletDeploy(deployed);
        }
    };

    const connect = () => {
        particle.auth
            .login()
            .then((info) => {
                console.log('connect success', info);
                setAccount(particle.auth.wallet()?.public_address);
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    const disconnect = () => {
        particle.auth
            .logout(true)
            .then(resetConnectState)
            .catch((error) => {
                message.error(error.message);
            });
    };

    const sendNativeTransaction = async (gasless: boolean = true) => {
        const recipientAddress = nativeRef.current[0].input.value;
        const amount = nativeRef.current[1].input.value;
        if (recipientAddress && amount) {
            setSendLoading(true);
            const tx = {
                to: recipientAddress,
                value: ethers.utils.parseEther(amount).toString(),
                data: '0x',
            };

            try {
                if (gasless) {
                    const txResponse = await smartAccount?.sendGaslessTransaction({ transaction: tx });
                    checkWalletIsDeploy();
                    console.log('sendGaslessTransaction', txResponse);
                } else {
                    await prepareRefundTransaction(tx);
                }
            } catch (error) {
                console.error('sendNativeTransaction', error);
            } finally {
                setSendLoading(false);
            }
        } else {
            message.warning('Please input Recipient Address and Amount');
        }
    };

    const sendERC20Transaction = async (gasless: boolean = true) => {
        const recipientAddress = erc20Ref.current[0].input.value;
        const contractAddress = erc20Ref.current[1].input.value;
        const amount = erc20Ref.current[2].input.value;
        if (recipientAddress && contractAddress && amount) {
            setSendLoading(true);
            const erc20Interface = new ethers.utils.Interface(['function transfer(address _to, uint256 _value)']);
            // Encode an ERC-20 token transfer to recipient of the specified amount
            const data = erc20Interface.encodeFunctionData('transfer', [
                recipientAddress,
                ethers.utils.parseEther(amount).toString(),
            ]);
            const tx = {
                to: contractAddress,
                data,
            };
            try {
                if (gasless) {
                    const txResponse = await smartAccount?.sendGaslessTransaction({ transaction: tx });
                    checkWalletIsDeploy();
                    console.log('sendERC20GaslessTransaction', txResponse);
                } else {
                    await prepareRefundTransaction(tx);
                }
            } catch (error) {
                console.error('sendERC20Transaction', error);
            } finally {
                setSendLoading(false);
            }
        } else {
            message.warning('Please input Recipient Address, Contract Address and Amount');
        }
    };

    const sendERC721Transaction = async (gasless: boolean = true) => {
        const recipientAddress = erc721Ref.current[0].input.value;
        const contractAddress = erc721Ref.current[1].input.value;
        const tokenId = erc721Ref.current[2].input.value;
        if (recipientAddress && contractAddress && tokenId) {
            setSendLoading(true);
            const erc721Interface = new ethers.utils.Interface([
                'function safeTransferFrom(address _from, address _to, uint256 _tokenId)',
            ]);
            const address = await smartAccount?.address;
            const data = erc721Interface.encodeFunctionData('safeTransferFrom', [address, recipientAddress, tokenId]);
            const tx = {
                to: contractAddress,
                data,
            };
            try {
                if (gasless) {
                    const txResponse = await smartAccount?.sendGaslessTransaction({ transaction: tx });
                    checkWalletIsDeploy();
                    console.log('sendERC721GaslessTransaction', txResponse);
                } else {
                    await prepareRefundTransaction(tx);
                }
            } catch (error) {
                console.error('sendERC721Transaction', error);
            } finally {
                setSendLoading(false);
            }
        } else {
            message.warning('Please input Recipient Address, Contract Address and Token ID');
        }
    };

    const sendERC1155Transaction = async (gasless: boolean = true) => {
        const recipientAddress = erc1155Ref.current[0].input.value;
        const contractAddress = erc1155Ref.current[1].input.value;
        const tokenId = erc1155Ref.current[2].input.value;
        const tokenAmount = erc1155Ref.current[3].input.value;

        if (recipientAddress && contractAddress && tokenId && tokenAmount) {
            setSendLoading(true);
            const erc1155Interface = new ethers.utils.Interface([
                'function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data)',
            ]);

            // Encode the transfer of the collectible to recipient
            const address = await smartAccount?.address;
            const data = erc1155Interface.encodeFunctionData('safeTransferFrom', [
                address,
                recipientAddress,
                tokenId,
                tokenAmount,
                '0x',
            ]);

            const tx = {
                to: contractAddress,
                data,
            };

            try {
                if (gasless) {
                    const txResponse = await smartAccount?.sendGaslessTransaction({ transaction: tx });
                    checkWalletIsDeploy();
                    console.log('sendERC1155GaslessTransaction', txResponse);
                } else {
                    await prepareRefundTransaction(tx);
                }
            } catch (error) {
                console.error('sendERC1155Transaction', error);
            } finally {
                setSendLoading(false);
            }
        } else {
            message.warning('Please input Recipient Address, Contract Address, Token ID and Token Amount');
        }
    };

    const handleSwitchChain = async (value: string) => {
        setSwitchChainLoading(true);
        const chainId = Number(value);
        const chainInfo = chains.getEVMChainInfoById(chainId);
        if (chainInfo && provider) {
            await particle.auth.switchChain(chainInfo, true);
            await smartAccount?.setActiveChain(chainId);
        }
        getEOABalance();
        getSCABalance();
        setSwitchChainLoading(false);
    };

    const prepareRefundTransaction = async (transaction: Transaction) => {
        const feeQuotes = await smartAccount?.prepareRefundTransaction({ transaction });
        console.log('prepareRefundTransaction', feeQuotes);
        setFeeQuotes(feeQuotes);
        setOpenPaymentOptions({ open: true, transaction });
    };

    const sendTransactionWithFeeQuote = async (feeQuote: FeeQuote) => {
        setSendLoading(true);
        setOpenPaymentOptions({ open: false });
        if (openPaymentOptions.transaction && smartAccount) {
            try {
                const transaction = await smartAccount.createRefundTransaction({
                    transaction: openPaymentOptions.transaction,
                    feeQuote: feeQuote,
                });
                const txId = await smartAccount.sendTransaction({
                    tx: transaction,
                });
                checkWalletIsDeploy();
                notification.success({
                    message: 'Send Transaction Success',
                    description: txId,
                });
            } catch (error) {
                console.error('sendTransactionWithFeeQuote', error);
            } finally {
                setSendLoading(false);
            }
        }
    };

    const getSCABalance = async () => {
        if (smartAccount) {
            setScaBalanceLoading(true);
            const balanceParams: BalancesDto = {
                // if no chainId is supplied, SDK will automatically pick active one that
                // is being supplied for initialization
                chainId: particle.auth.chainId(), // chainId of your choice
                eoaAddress: smartAccount?.address || '',
                // If empty string you receive balances of all tokens watched by Indexer
                // you can only whitelist token addresses that are listed in token respostory
                // specified above ^
                tokenAddresses: [],
            };
            const balFromSdk = await smartAccount?.getAlltokenBalances(balanceParams);

            setScaBalance(balFromSdk.data);
            console.info('getAlltokenBalances', balFromSdk);
            setScaBalanceLoading(false);
        }
    };

    const formatScaBalance = (scaBalance: IBalances[]) => {
        const chain = chains.getEVMChainInfoById(particle.auth.chainId());
        if (scaBalance) {
            const nativeBalance = scaBalance.find((item: any) => item.native_token);
            if (nativeBalance) {
                return `${ethers.utils.formatEther(nativeBalance.balance)} ${chain?.nativeCurrency.symbol}`;
            }
        }
        return `0.0 ${chain?.nativeCurrency.symbol}`;
    };

    const getEOABalance = async () => {
        if (account && provider) {
            setEoaBalanceLoading(true);
            const balance = await provider.getBalance(account);
            const chain = chains.getEVMChainInfoById(particle.auth.chainId());
            setEoaBalance(`${ethers.utils.formatEther(balance)} ${chain?.nativeCurrency.symbol}`);
            setEoaBalanceLoading(false);
        }
    };

    const openExplorer = (address: string) => {
        const chain = chains.getEVMChainInfoById(particle.auth.chainId());
        if (chain) {
            const explorerUrl = `${chain.blockExplorerUrls[0]}/address/${address}`;
            window.open(explorerUrl);
        }
    };

    const feeTokenBalance = (feeQuote: FeeQuote) => {
        if (feeQuote.address === '0x0000000000000000000000000000000000000000') {
            const nativeBalance = scaBalance.find((item: any) => item.native_token);
            if (nativeBalance) {
                return `${ethers.utils.formatEther(nativeBalance.balance)}`;
            }
        }
        const tokenBalance = scaBalance.find((item) => item.contract_address === feeQuote.address);
        if (tokenBalance) {
            return `${fromWei(tokenBalance.balance, DecimalUnitMap[tokenBalance.contract_decimals])}`;
        }
        return `0.0`;
    };

    const formatFeeQuote = (feeQuote: FeeQuote) => {
        return `-${fromWei(feeQuote.payment, DecimalUnitMap[feeQuote.decimal])}`;
    };

    const deployWalletContract = async () => {
        if (smartAccount) {
            setDeployLoading(true);
            try {
                await smartAccount.deployWalletUsingPaymaster();
                message.success('Smart Contract Wallet Deployed Successfully');
            } catch (error) {
                console.error('deployWalletContract', error);
            } finally {
                setDeployLoading(false);
            }
        }
    };

    return (
        <div className="erc4337-box">
            <div className="header-content">
                <div className="logo-title">
                    <img src={require('../../common/img/logo.png')} alt="" />
                    Particle & Biconomy
                </div>

                <Button className="connect-btn" onClick={account ? disconnect : connect} type="primary">
                    {account ? 'Disconnect' : 'Connect'}
                </Button>

                {account && smartAccount?.address && (
                    <Select
                        className="connect-chain"
                        defaultValue="5"
                        onChange={handleSwitchChain}
                        loading={switchChainLoading}
                        options={[
                            { value: '5', label: 'Ethereum Goerli' },
                            { value: '80001', label: 'Polygon Mumbai' },
                            { value: '97', label: 'BSC Testnet' },
                        ]}
                    />
                )}
            </div>

            <div className="content-body">
                <Card className="docs-card" title="Document">
                    <Space direction="vertical">
                        <a href="https://eips.ethereum.org/EIPS/eip-4337" target="_blank" rel="noopener noreferrer">
                            ERC-4337: Account Abstraction
                        </a>
                        <a href="https://docs.particle.network/" target="_blank" rel="noopener noreferrer">
                            Particle Network Docs
                        </a>
                        <a
                            href="https://biconomy.gitbook.io/sdk/introduction/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Biconomy Docs
                        </a>
                    </Space>
                </Card>

                {account && (
                    <Card className="account-card" title="Account">
                        <Space direction="vertical">
                            <div className="account-info">
                                <div className="account-type">EOA:</div>
                                <div
                                    className="account-address"
                                    onClick={() => {
                                        navigator.clipboard.writeText(account);
                                        message.success('copy success');
                                    }}
                                >
                                    {shortString(account)}
                                </div>
                                <LinkOutlined
                                    style={{ marginLeft: 10, color: '#1677ff' }}
                                    onClick={() => openExplorer(account)}
                                />
                            </div>

                            <div className="balance-info">
                                EOA Balance:&nbsp;
                                <div>{`${eoaBalance}`}</div>
                                <RedoOutlined
                                    spin={eoaBalanceLoading}
                                    style={{ marginLeft: 10, color: '#1677ff' }}
                                    onClick={getEOABalance}
                                />
                            </div>

                            {smartAccount?.address && (
                                <>
                                    <div className="account-info">
                                        <div className="account-type">SCA:</div>
                                        <div
                                            className="account-address"
                                            onClick={() => {
                                                navigator.clipboard.writeText(smartAccount?.address);
                                                message.success('copy success');
                                            }}
                                        >
                                            {shortString(smartAccount?.address)}
                                        </div>
                                        <LinkOutlined
                                            style={{ marginLeft: 10, color: '#1677ff' }}
                                            onClick={() => openExplorer(smartAccount?.address)}
                                        />

                                        {walletDeploy !== undefined && (
                                            <Button
                                                className="btn_deploy"
                                                type="primary"
                                                disabled={walletDeploy}
                                                icon={<DeploymentUnitOutlined />}
                                                onClick={deployWalletContract}
                                                loading={deployLoading}
                                                danger
                                            >
                                                {walletDeploy ? 'Deployed' : 'Deploy'}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="balance-info">
                                        SCA Balance:&nbsp;
                                        <div>{`${formatScaBalance(scaBalance)}`}</div>
                                        <RedoOutlined
                                            spin={scaBalanceLoading}
                                            style={{ marginLeft: 10, color: '#1677ff' }}
                                            onClick={getSCABalance}
                                        />
                                    </div>
                                </>
                            )}
                        </Space>
                    </Card>
                )}

                {account && !smartAccount?.address && <Spin className="spin-loading" size="large" />}

                {smartAccount?.address && (
                    <>
                        <Card
                            className="tx-card"
                            title="Send Natvie Token"
                            actions={[
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendNativeTransaction(false)}
                                >
                                    Send
                                </Button>,
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendNativeTransaction()}
                                >
                                    Gasless Send
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Recipient Address"
                                    ref={(ref) => {
                                        nativeRef.current[0] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Amount"
                                    ref={(ref) => {
                                        nativeRef.current[1] = ref;
                                    }}
                                ></Input>
                            </Space>
                        </Card>

                        <Card
                            className="tx-card"
                            title="Send ERC-20"
                            actions={[
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC20Transaction(false)}
                                >
                                    Send
                                </Button>,
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC20Transaction()}
                                >
                                    Gasless Send
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Recipient Address"
                                    ref={(ref) => {
                                        erc20Ref.current[0] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Contract Address"
                                    ref={(ref) => {
                                        erc20Ref.current[1] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Amount"
                                    ref={(ref) => {
                                        erc20Ref.current[2] = ref;
                                    }}
                                ></Input>
                            </Space>
                        </Card>

                        <Card
                            className="tx-card"
                            title="Send ERC-721"
                            actions={[
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC721Transaction(false)}
                                >
                                    Send
                                </Button>,
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC721Transaction()}
                                >
                                    Gasless Send
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Recipient Address"
                                    ref={(ref) => {
                                        erc721Ref.current[0] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Contract Address"
                                    ref={(ref) => {
                                        erc721Ref.current[1] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Token ID"
                                    ref={(ref) => {
                                        erc721Ref.current[2] = ref;
                                    }}
                                ></Input>
                            </Space>
                        </Card>

                        <Card
                            className="tx-card"
                            title="Send ERC-1155"
                            actions={[
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC1155Transaction(false)}
                                >
                                    Send
                                </Button>,
                                <Button
                                    type="text"
                                    loading={sendLoading}
                                    className="action-btn"
                                    onClick={() => sendERC1155Transaction()}
                                >
                                    Gasless Send
                                </Button>,
                            ]}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    placeholder="Recipient Address"
                                    ref={(ref) => {
                                        erc1155Ref.current[0] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Contract Address"
                                    ref={(ref) => {
                                        erc1155Ref.current[1] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Token ID"
                                    ref={(ref) => {
                                        erc1155Ref.current[2] = ref;
                                    }}
                                ></Input>
                                <Input
                                    placeholder="Token Amount"
                                    ref={(ref) => {
                                        erc1155Ref.current[3] = ref;
                                    }}
                                ></Input>
                            </Space>
                        </Card>
                    </>
                )}
            </div>
            <Modal
                className="payment_options"
                title="Transaction Fee Payment Options​"
                open={openPaymentOptions.open}
                onCancel={() => setOpenPaymentOptions({ open: false })}
                maskClosable={false}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {feeQuotes?.map((option) => (
                        <div
                            className="fee_option"
                            key={option.address}
                            onClick={() => sendTransactionWithFeeQuote(option)}
                        >
                            <img src={option.logoUrl} />

                            <div className="fee_token_info">
                                <div className="fee_token">{option.symbol}</div>
                                <div
                                    className="fee_token_address"
                                    onClick={(e) => {
                                        openExplorer(option.address);
                                        e.stopPropagation();
                                    }}
                                >
                                    {shortString(option.address)}
                                </div>
                            </div>

                            <div className="fee_token_balance">
                                <div className="balance">{feeTokenBalance(option)}</div>
                                <div className="payment">{formatFeeQuote(option)}</div>
                            </div>
                        </div>
                    ))}
                </Space>
            </Modal>
        </div>
    );
};

export default PageERC4337;
