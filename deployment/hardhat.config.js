require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: ["YOUR_PRIVATE_KEY_HERE"] // Replace with your private key
    }
  }
};