const { abi, bytecode } = require("../artifacts/contracts/EcoFilend.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");

const NETWORK = avalancheFuji;

const routerAddress = networks[NETWORK].functionsRouter;
const donIdBytes32 = utils.formatBytes32String(networks[NETWORK].donId);

const deployEcoFilend = async () => {
    const contractFactory = new ContractFactory(abi, bytecode, wallet);

    console.log(
        `\n Deploying EcoFilend on network ${NETWORK}...`
    );

    const ecoFilend = await contractFactory.connect(signer)
        .deploy()
}