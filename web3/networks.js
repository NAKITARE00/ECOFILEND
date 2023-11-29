require("@chainlink/env-enc").config()

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const networks = {
    avalancheFuji: {
        gasPrice: undefined,
        nonce: undefined,
        accounts: [PRIVATE_KEY],
        verifyApiKey: process.env.AVASCAN_API_KEY || "UNSET",
        chainId: 43113,
        confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
        nativeCurrencySymbol: "AVAX",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        linkPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734", // LINK/ETH
        functionsRouter: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
        donId: "fun-avalanche-fuji-1",
        gatewayUrls: [
            "https://01.functions-gateway.testnet.chain.link/",
            "https://02.functions-gateway.testnet.chain.link/",
        ],
    },
    polygonMumbai: {
        gasPrice: 20_000_000_000,
        nonce: undefined,
        accounts: [PRIVATE_KEY],
        verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
        chainId: 80001,
        confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
        nativeCurrencySymbol: "MATIC",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        linkPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528", // LINK/MATIC
        functionsRouter: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
        donId: "fun-polygon-mumbai-1",
        gatewayUrls: [
            "https://01.functions-gateway.testnet.chain.link/",
            "https://02.functions-gateway.testnet.chain.link/",
        ],
    }
};


module.exports = {
    networks,
};