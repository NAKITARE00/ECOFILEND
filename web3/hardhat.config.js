require("@matterlabs/hardhat-zksync-solc");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }, viaIR: true,
    },
  },
  networks: {
    avalancheFuji: {
      url: `https://api.avax-test.network/ext/C/rpc`,
      accounts: process.env.PRIVATE_KEY,
      chainId: 43113
    }
  },
  etherscan: {

    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  }
}
