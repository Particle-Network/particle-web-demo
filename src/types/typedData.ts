export const payloadV4 = {
    types: {
        EIP712Domain: [
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'version',
                type: 'string',
            },
            {
                name: 'chainId',
                type: 'uint256',
            },
            {
                name: 'verifyingContract',
                type: 'address',
            },
        ],
        Order: [
            {
                name: 'exchange',
                type: 'address',
            },
            {
                name: 'maker',
                type: 'address',
            },
            {
                name: 'taker',
                type: 'address',
            },
            {
                name: 'makerRelayerFee',
                type: 'uint256',
            },
            {
                name: 'takerRelayerFee',
                type: 'uint256',
            },
            {
                name: 'makerProtocolFee',
                type: 'uint256',
            },
            {
                name: 'takerProtocolFee',
                type: 'uint256',
            },
            {
                name: 'feeRecipient',
                type: 'address',
            },
            {
                name: 'feeMethod',
                type: 'uint8',
            },
            {
                name: 'side',
                type: 'uint8',
            },
            {
                name: 'saleKind',
                type: 'uint8',
            },
            {
                name: 'target',
                type: 'address',
            },
            {
                name: 'howToCall',
                type: 'uint8',
            },
            {
                name: 'calldata',
                type: 'bytes',
            },
            {
                name: 'replacementPattern',
                type: 'bytes',
            },
            {
                name: 'staticTarget',
                type: 'address',
            },
            {
                name: 'staticExtradata',
                type: 'bytes',
            },
            {
                name: 'paymentToken',
                type: 'address',
            },
            {
                name: 'basePrice',
                type: 'uint256',
            },
            {
                name: 'extra',
                type: 'uint256',
            },
            {
                name: 'listingTime',
                type: 'uint256',
            },
            {
                name: 'expirationTime',
                type: 'uint256',
            },
            {
                name: 'salt',
                type: 'uint256',
            },
            {
                name: 'nonce',
                type: 'uint256',
            },
        ],
    },
    primaryType: 'Order',
    domain: {
        name: 'LifeForm Exchange Contract',
        version: '2.3',
        chainId: '97',
        verifyingContract: '0x9407Ec32b440aEcbDbC1Ff93324Af5FE626D4dd3',
    },
    message: {
        exchange: '0x9407Ec32b440aEcbDbC1Ff93324Af5FE626D4dd3',
        maker: '0x2CeD4F9bBfcD178F7Cf0F949249cd1C3b649bDb7',
        taker: '0x0000000000000000000000000000000000000000',
        makerRelayerFee: 50,
        takerRelayerFee: 0,
        makerProtocolFee: 0,
        takerProtocolFee: 0,
        feeMethod: 1,
        side: 1,
        saleKind: 0,
        target: '0xC4f609c43448b462a042e5E5E9E2100D070A0E04',
        howToCall: 0,
        calldata:
            '0xf242432a0000000000000000000000002ced4f9bbfcd178f7cf0f949249cd1c3b649bdb70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025b378602000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
        replacementPattern:
            '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        staticTarget: '0x0000000000000000000000000000000000000000',
        staticExtradata: '0x',
        paymentToken: '0x4f500465c89c2f8A44D1142e02338534C0c421be',
        basePrice: '1000000000000000000',
        extra: 0,
        listingTime: 1666347130,
        expirationTime: 1666606330,
        salt: '1666347130000',
        feeRecipient: '0xfE517e9d1E74787660a3202D3916367c6e363f2e',
        nonce: '0',
    },
};
