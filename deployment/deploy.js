const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleVault to Sepolia...");
  
  const SimpleVault = await hre.ethers.getContractFactory("SimpleVault");
  const vault = await SimpleVault.deploy();
  
  await vault.waitForDeployment();
  
  const address = await vault.getAddress();
  console.log("SimpleVault deployed to:", address);
  console.log("Update lib/contracts.ts with this address!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});