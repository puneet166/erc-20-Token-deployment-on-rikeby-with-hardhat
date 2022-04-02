// const { network } = require("hardhat");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
const endPoint = process.env.URL;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: endPoint,
      accounts: [`0x${privateKey}`]
    }
  }
}