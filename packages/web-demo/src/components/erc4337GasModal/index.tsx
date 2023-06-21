import { FeeQuote } from '@particle-network/biconomy/lib/types/types';
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
    const [selectFeeQuote, setSelectFeeQuote] = useState<FeeQuote>();

    useEffect(() => {
        events.on('erc4337:prepareTransaction', (feeQuotes) => {
            setFeeQuotes(feeQuotes);
            setOpen(true);
        });
        return () => {
            events.removeAllListeners('erc4337:prepareTransaction');
        };
    }, []);

    useEffect(() => {
        if (feeQuotes) {
            for (let feeQuote of feeQuotes) {
                if (hasEnoughGas(feeQuote)) {
                    setSelectFeeQuote(feeQuote);
                    break;
                }
            }
        }
    }, [feeQuotes]);

    useEffect(() => {
        if (!open) {
            setFeeQuotes(undefined);
            setSelectFeeQuote(undefined);
        }
    }, [open]);

    const onClose = () => {
        events.emit('erc4337:sendTransactionError', new Error('Transaction cancelled'));
        setOpen(false);
    };

    const sendTransaction = () => {
        events.emit('erc4337:sendTransaction', { feeQuote: selectFeeQuote });
        setOpen(false);
    };

    const sendGaslessTransaction = () => {
        events.emit('erc4337:sendTransaction');
        setOpen(false);
    };

    const feeTokenBalance = (feeQuote: FeeQuote) => {
        return ethers.utils.formatUnits(feeQuote.tokenBalance, feeQuote.decimal);
    };

    const formatFeeQuote = (feeQuote: FeeQuote) => {
        try {
            return `-${ethers.utils.formatUnits(feeQuote.tokenBalance, feeQuote.decimal)}`;
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    const hasEnoughGas = (feeQuote: FeeQuote) => {
        const fee = feeQuote.payment;
        const balance = feeQuote.tokenBalance;
        return balance && new BigNumber(balance).gte(new BigNumber(fee));
    };

    const contentBody = () => {
        return (
            <div className="fee-drawer-content">
                <div className="fee-list">
                    {feeQuotes &&
                        feeQuotes.map((feeQuote) => {
                            return (
                                <div
                                    className={`gas-fee-item ${hasEnoughGas(feeQuote) ? '' : 'disabled'}`}
                                    key={feeQuote.address}
                                    onClick={() => {
                                        if (hasEnoughGas(feeQuote)) {
                                            setSelectFeeQuote(feeQuote);
                                        }
                                    }}
                                >
                                    <Radio
                                        className="fee-radio"
                                        checked={selectFeeQuote?.address === feeQuote.address}
                                        disabled={!hasEnoughGas(feeQuote)}
                                    ></Radio>
                                    <Image className="fee-token-icon" preview={false} src={feeQuote.logoUrl}></Image>
                                    <div className="fee-token-info">
                                        <div className="fee-name">{feeQuote.symbol}</div>
                                        <div className="fee-address">
                                            {feeQuote.address.substring(0, 5) +
                                                '...' +
                                                feeQuote.address.substring(feeQuote.address.length - 5)}
                                        </div>
                                    </div>
                                    <div className="fee-token-balance">
                                        <div className="gas-fee">{formatFeeQuote(feeQuote)}</div>
                                        <div className="token-balance">
                                            {hasEnoughGas(feeQuote)
                                                ? feeTokenBalance(feeQuote)
                                                : 'Insufficient balance'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="bootom-action">
                    <Button
                        type="primary"
                        className="btn-user-paid"
                        onClick={sendTransaction}
                        disabled={selectFeeQuote === undefined}
                    >
                        Send
                    </Button>
                    <Button type="primary" className="btn-gasless" onClick={sendGaslessTransaction}>
                        Gasless Send
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
