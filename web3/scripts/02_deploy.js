const { abi, bytecode } = require("../artifacts-zk/contracts/EcoFilend.sol/EcoFilend.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");
const { Location } = require("@chainlink/functions-toolkit");
const fs = require("fs");
const path = require("path");

const NETWORK = "avalancheFuji";

const ccip_router = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
const tokenAddress = "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4";
const destinationChainSelector = "16015286601757825753";
const functions_router = networks[NETWORK].functionsRouter;
const source = fs
    .readFileSync(path.resolve(__dirname, "../source.js"))
    .toString();
const encryptedSecretsReference = "0xa266736c6f744964006776657273696f6e1a656c3691";
const subscriptionId = "1525";
const stakeCertMinter = "0x1FF263E7Ce2d42384Da9996173C258277cF82464";
const deployEcoFilend = async () => {
    const contractFactory = new ContractFactory(abi, bytecode, wallet);

    console.log(
        `\n Deploying EcoFilend on network ${NETWORK}...`
    );

    const ecoFilend = await contractFactory.connect(signer)
        .deploy(
            ccip_router,
            linkAddress,
            tokenAddress,
            destinationChainSelector,
            functions_router,
            source,
            encryptedSecretsReference,
            [],
            subscriptionId,
            stakeCertMinter
        );
    await ecoFilend.deployed();
    console.log(`\n Deployed at address ${ecoFilend.address}`)
};

deployEcoFilend().catch(err => {
    console.log("Error deploying Contract", err);
})