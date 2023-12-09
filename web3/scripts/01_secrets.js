const { SecretsManager } = require("@chainlink/functions-toolkit");
const { signer } = require("../connection.js");
const { networks } = require("../networks.js");
require("@chainlink/env-enc").config();

const NETWORK = "avalancheFuji";

const functionsRouterAddress = networks[NETWORK].functionsRouter;
const donId = networks[NETWORK].donId;

const secrestUploadAndEncryption = async () => {
    const secretsManager = new SecretsManager({
        signer,
        functionsRouterAddress,
        donId,
    });

    await secretsManager.initialize();

    if (!process.env.IQAIRAPI) {
        throw Error("Api key not founf in the .env.enc file");
    }

    const secrets = {
        apiKey: process.env.IQAIRAPI,
    };

    const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

    const gatewayUrls = networks[NETWORK].gatewayUrls;
    const slotId = 0;
    const minutesUntilExpiration = 2880;

    const {
        version,
        success,
    } = await secretsManager.uploadEncryptedSecretsToDON({
        encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
        gatewayUrls,
        slotId,
        minutesUntilExpiration
    });

    if (success) {
        console.log("\nSecrets Upload To DON successful")
        const encryptedSecretsReference = secretsManager.buildDONHostedEncryptedSecretsReference({
            slotId,
            version
        })

        console.log(`\nMake a note of the encryptedSecretsReference: ${encryptedSecretsReference}, version: ${version} `)
    }

};
secrestUploadAndEncryption().catch(err => {
    console.log("Error encrypting and uploading secrets:  ", err);
});

