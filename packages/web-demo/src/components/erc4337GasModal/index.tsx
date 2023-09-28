import { FeeQuote, FeeQuotesResponse } from '@particle-network/aa/lib/types/types';
import { isNullish } from '@particle-network/auth';
import { Button, Drawer, Image, Modal, Radio } from 'antd';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { isMobile } from '../../utils';
import events from '../../utils/eventBus';
import './index.scss';

const Erc4337GasModal = () => {
    const [open, setOpen] = useState(false);
    const [feeQuotes, setFeeQuotes] = useState<FeeQuote[]>();
    const [feeQuotesResponse, setFeeQuotesResponse] = useState<FeeQuotesResponse>();
    const [selectFeeQuote, setSelectFeeQuote] = useState<FeeQuote | null>();

    useEffect(() => {
        events.on('erc4337:prepareTransaction', (response: FeeQuotesResponse) => {
            setFeeQuotes([response.verifyingPaymasterNative.feeQuote!, ...(response.tokenPaymaster?.feeQuotes ?? [])]);
            setFeeQuotesResponse(response);
            setOpen(true);
        });
        return () => {
            events.removeAllListeners('erc4337:prepareTransaction');
        };
    }, []);

    useEffect(() => {
        if (feeQuotes) {
            if (feeQuotesResponse?.verifyingPaymasterGasless) {
                //gasless
                setSelectFeeQuote(null);
            } else {
                for (let feeQuote of feeQuotes) {
                    if (hasEnoughGas(feeQuote)) {
                        setSelectFeeQuote(feeQuote);
                        break;
                    }
                }
            }
        }
    }, [feeQuotes, feeQuotesResponse]);

    useEffect(() => {
        if (!open) {
            setFeeQuotes(undefined);
            setSelectFeeQuote(undefined);
            setFeeQuotesResponse(undefined);
        }
    }, [open]);

    const onClose = () => {
        events.emit('erc4337:sendTransactionError', new Error('Transaction cancelled'));
        setOpen(false);
    };

    const sendTransaction = () => {
        if (selectFeeQuote === null && feeQuotesResponse?.verifyingPaymasterGasless) {
            const { userOp, userOpHash } = feeQuotesResponse?.verifyingPaymasterGasless;
            events.emit('erc4337:sendTransaction', { userOp, userOpHash });
        } else if (
            selectFeeQuote &&
            '0x0000000000000000000000000000000000000000' === selectFeeQuote.tokenInfo.address &&
            feeQuotesResponse
        ) {
            const { userOp, userOpHash } = feeQuotesResponse.verifyingPaymasterNative;
            events.emit('erc4337:sendTransaction', { userOp, userOpHash });
        } else if (selectFeeQuote && feeQuotesResponse?.tokenPaymaster) {
            events.emit('erc4337:sendTransaction', {
                feeQuote: selectFeeQuote,
                tokenPaymasterAddress: feeQuotesResponse?.tokenPaymaster.tokenPaymasterAddress,
            });
        }
        setOpen(false);
    };

    const feeTokenBalance = (feeQuote: FeeQuote) => {
        return ethers.utils.formatUnits(feeQuote.balance, feeQuote.tokenInfo.decimals);
    };

    const formatFeeQuote = (feeQuote: FeeQuote) => {
        try {
            return `-${ethers.utils.formatUnits(feeQuote.fee, feeQuote.tokenInfo.decimals)}`;
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const hasEnoughGas = (feeQuote: FeeQuote) => {
        const fee = feeQuote.fee;
        const balance = feeQuote.balance;
        return balance && new BigNumber(balance).gte(new BigNumber(fee));
    };

    const contentBody = () => {
        return (
            <div className="fee-drawer-content">
                <div className="fee-list">
                    {feeQuotesResponse && (
                        <div
                            className={`gas-fee-item ${feeQuotesResponse.verifyingPaymasterGasless ? '' : 'disabled'}`}
                            onClick={() => {
                                if (feeQuotesResponse.verifyingPaymasterGasless) {
                                    setSelectFeeQuote(null);
                                }
                            }}
                        >
                            <Radio
                                className="fee-radio"
                                checked={selectFeeQuote === null}
                                disabled={isNullish(feeQuotesResponse.verifyingPaymasterGasless)}
                            ></Radio>
                            <Image
                                className="fee-token-icon"
                                preview={false}
                                src={require('../../common/icons/aa-icon-gasless.png')}
                            ></Image>
                            <div className="fee-token-info">Gassless</div>
                            <div className="fee-token-balance">Free</div>
                        </div>
                    )}

                    {feeQuotes?.map((feeQuote) => {
                        return (
                            <div
                                className={`gas-fee-item ${hasEnoughGas(feeQuote) ? '' : 'disabled'}`}
                                key={feeQuote.tokenInfo.address}
                                onClick={() => {
                                    if (hasEnoughGas(feeQuote)) {
                                        setSelectFeeQuote(feeQuote);
                                    }
                                }}
                            >
                                <Radio
                                    className="fee-radio"
                                    checked={selectFeeQuote?.tokenInfo?.address === feeQuote.tokenInfo.address}
                                    disabled={!hasEnoughGas(feeQuote)}
                                ></Radio>
                                <Image
                                    className="fee-token-icon"
                                    preview={false}
                                    src={feeQuote.tokenInfo.logoURI}
                                ></Image>
                                <div className="fee-token-info">
                                    <div className="fee-name">{feeQuote.tokenInfo.symbol}</div>
                                    <div className="fee-address">
                                        {feeQuote.tokenInfo.address.substring(0, 5) +
                                            '...' +
                                            feeQuote.tokenInfo.address.substring(feeQuote.tokenInfo.address.length - 5)}
                                    </div>
                                </div>
                                <div className="fee-token-balance">
                                    <div className="gas-fee">{formatFeeQuote(feeQuote)}</div>
                                    <div className="token-balance">
                                        {hasEnoughGas(feeQuote) ? feeTokenBalance(feeQuote) : 'Insufficient balance'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bootom-action">
                    <Button
                        type="primary"
                        className="btn-aa-send"
                        onClick={sendTransaction}
                        disabled={selectFeeQuote === undefined}
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    };

    return !isMobile() ? (
        <Modal
            className="erc4337-modal-container"
            zIndex={2000}
            centered={true}
            open={open}
            maskClosable={false}
            title="Network Fee"
            onCancel={onClose}
        >
            {contentBody()}
        </Modal>
    ) : (
        <Drawer
            className="erc4337-transaction-container"
            zIndex={2000}
            open={open}
            placement="bottom"
            maskClosable={false}
            title="Network Fee"
            height={'auto'}
            onClose={onClose}
        >
            {contentBody()}
        </Drawer>
    );
};

export default Erc4337GasModal;
