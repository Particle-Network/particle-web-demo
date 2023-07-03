import { useState } from 'react';
import { Button, message, Input, InputNumber, notification } from 'antd';
import { addHexPrefix, intToHex } from '@ethereumjs/util';
import { toWei, isValidEVMAddress } from '../../../utils';

function SendERC20Approve(props: any) {
    const [loading, setLoading] = useState<number>(0);
    const defReceiveAddress: string = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    const defContractAddress: string = '0xFab46E002BbF0b4509813474841E0716E6730136';
    const defAmount: string = '0.001';
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [ercAmount, setErcAmount] = useState<string>();

    const sendERC20Approve = async () => {
        setLoading(1);
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const method = 'particle_abi_encodeFunctionCall';

        const address = receiveAddress || defReceiveAddress;
        const amount = ercAmount || defAmount;

        const amountWei = toWei(amount, 'ether');
        const contract = contractAddress || defContractAddress;

        if (!isValidEVMAddress(address)) {
            setLoading(0);
            return notification.error({
                message: 'Please enter the correct receive address',
            });
        }
        if (!isValidEVMAddress(contract)) {
            setLoading(0);
            return notification.error({
                message: 'Please enter the correct contract address',
            });
        }
        const params = [contract, 'erc20_approve', [address, amountWei]];

        try {
            //@ts-ignore
            const result = await window.web3.currentProvider.request({
                method,
                params,
                from,
            });

            const gasLimit = await window.web3.eth.estimateGas({
                from: from,
                to: contract,
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: accounts[0],
                to: contract,
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
                    notification.success({
                        message: 'Send Success',
                        description: hash,
                    });
                }
                setLoading(0);
            });
        } catch (e: any) {
            setLoading(0);
            console.log('sendERC20Approve', e);
            message.error(e.message ?? e);
        }
    };
    return (
        <div className="form-item card">
            <h3>ERC20 Approve</h3>
            <div className="form-input">
                <label>
                    <p>Receive address</p>
                    <Input
                        placeholder={defReceiveAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setReceiveAddress(e.target?.value)}
                    ></Input>
                </label>
                <label>
                    <p>Contract address</p>
                    <Input
                        placeholder={defContractAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setContractAddress(e.target.value)}
                    ></Input>
                </label>
                <label>
                    <p>Token amount</p>
                    <InputNumber
                        min={0}
                        max={10000}
                        precision={5}
                        placeholder={defAmount}
                        readOnly={!!loading}
                        onChange={(e: any) => setErcAmount(e?.toString())}
                    ></InputNumber>
                </label>
            </div>

            <div className="form-submit">
                <Button type="primary" loading={loading === 1} onClick={sendERC20Approve} disabled={!props.loginState}>
                    SEND
                </Button>
            </div>
        </div>
    );
}

export default SendERC20Approve;
