import { addHexPrefix, intToHex } from '@ethereumjs/util';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { useState } from 'react';
import { isValidEVMAddress } from '../../../utils';

function SendERC721Tokens(props: any) {
    const defReceiveAddress: string = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
    const defContractAddress: string = '0xDF27A250c425Ba6721d399bf09259e6a089D6157';
    const defTokenId = '1';

    const [loading, setLoading] = useState(0);
    const [receiveAddress, setReceiveAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>(defTokenId);

    const sendERC721Transaction = async () => {
        setLoading(1);
        const accounts = await window.web3.eth.getAccounts();
        const from = accounts[0];
        const address = receiveAddress || defReceiveAddress;
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
        const method = 'particle_abi_encodeFunctionCall';
        const params = [contract, 'erc721_safeTransferFrom', [from, address, tokenId]];
        try {
            const result = await (window.web3.currentProvider as any).request({
                method,
                params,
                from,
            });

            const estimate = await window.web3.eth.estimateGas({
                from: from,
                to: contract,
                value: '0x0',
                data: result,
            });

            const txnParams = {
                from: from,
                to: contract,
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
                    notification.success({
                        message: 'Send Success',
                        description: hash,
                    });
                }
                setLoading(0);
            });
        } catch (e: any) {
            console.log('sendERC721Transaction', e);
            message.error(e.message ?? e);
            setLoading(0);
        }
    };

    return (
        <div className="form-item card">
            <h3>Send ERC721 Token</h3>
            <div className="form-input">
                <label>
                    <p>Receive address</p>
                    <Input
                        className="input"
                        placeholder={defReceiveAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setReceiveAddress(e.target.value)}
                    ></Input>
                </label>
                <label>
                    <p>Contract address</p>
                    <Input
                        className="input"
                        placeholder={defContractAddress}
                        readOnly={!!loading}
                        // @ts-ignore
                        onInput={(e) => setContractAddress(e.target.value)}
                    ></Input>
                </label>
                <label>
                    <p>Token ID</p>
                    <InputNumber
                        precision={0}
                        min={0}
                        max={10000}
                        className="input"
                        placeholder={defTokenId}
                        readOnly={!!loading}
                        onChange={(e: any) => setTokenId(e?.toString())}
                    ></InputNumber>
                </label>
            </div>

            <div className="form-submit">
                <Button
                    disabled={!props.loginState}
                    type="primary"
                    loading={loading === 1}
                    onClick={sendERC721Transaction}
                >
                    SEND
                </Button>
            </div>
        </div>
    );
}

export default SendERC721Tokens;
