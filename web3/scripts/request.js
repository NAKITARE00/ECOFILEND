const { Contract } = require("ethers");
const fs = require("fs");
const path = require("path");
require("@chainlink/env-enc").config();
const { networks } = require("../networks.js");
const { signer } = require("../connection.js");
const { abi } = require("../artifacts-zk/contracts/FunctionsConsumer.json");


const NETWORK = "avalancheFuji";
const consumerAddress = "0x5e170295F9c11153a20267859e5332C560b177f5";

const sendRequest = async () => {

    const functionsConsumer = new Contract(consumerAddress, abi, signer);

    const source = fs
        .readFileSync(path.resolve(__dirname, "../source.js"))
        .toString();
    const donHostedSecretsSlotID = 0;
    const donHostedSecretsVersion = 1701590673;
    const subscriptionId = 1525;
    const gasLimit = 300_000;
    const donId = utils.formatBytes32String(networks[NETWORK].donId);
    console.log("\n Sending the request ...")
    const requestTx = await functionsConsumer.sendRequest(
        source,
        donHostedSecretsSlotID,
        donHostedSecretsVersion,
        [],
        subscriptionId,
        gasLimit,
        donId
    );
    const txReceipt = await requestTx.wait(1);
    const requestId = txReceipt.events[2].args.id;
    console.log(
        `\nRequest made.  Request Id is ${requestId}. TxHash is ${requestTx.hash}`
    );
}

sendRequest().catch(err => {
    console.log("\nError making the Functions Request : ", err);
});
