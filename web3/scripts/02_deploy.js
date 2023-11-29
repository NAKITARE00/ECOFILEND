const { abi, bytecode } = require("../artifacts/contracts/EcoFilend.json");
const { wallet, signer } = require("../connection.js");
const { networks } = require("../networks.js");
const { ContractFactory, utils } = require("ethers");
const { Location } = require("@chainlink/functions-toolkit");

const NETWORK = avalancheFuji;


const ccip_router = "";
const linkAddress = "";
const tokenAddress = "";
const destinationChainSelector = "";
const routerAddress = networks[NETWORK].functionsRouter;
const donIdBytes32 = utils.formatBytes32String(networks[NETWORK].donId);
const source = fs
    .readFileSync(path.resolve(__dirname, "../source.js"))
    .toString();
const secretsLocation = Location.DONHosted;
const encryptedSecretsReference = "";
const subscriptionId = "";
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
            routerAddress,
            donIdBytes32,
            source,
            secretsLocation,
            encryptedSecretsReference,
            [],
            subscriptionId,
            callbackGasLimit
        )
}