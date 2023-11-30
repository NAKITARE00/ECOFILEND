const { abi, bytecode } = require("../artifacts/contracts/EcoFilend.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");
const { Location } = require("@chainlink/functions-toolkit");

const NETWORK = avalancheFuji;


const ccip_router = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
const tokenAddress = "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4";
const destinationChainSelector = "16015286601757825753";
const functions_router = networks[NETWORK].functionsRouter;
const donIdBytes32 = utils.formatBytes32String(networks[NETWORK].donId);
const source = fs
    .readFileSync(path.resolve(__dirname, "../source.js"))
    .toString();
const secretsLocation = Location.DONHosted;
const encryptedSecretsReference = "";
const subscriptionId = "1525";
const callbackGasLimit = 300_000;
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
            donIdBytes32,
            source,
            secretsLocation,
            encryptedSecretsReference,
            [],
            subscriptionId,
            callbackGasLimit
        );
    await ecoFilend.deployed();
    console.log(`\n Deployed at address ${ecoFilend.address}`)
};

deployEcoFilend().catch(err => {
    console.log("Error deploying Contract", err);
})