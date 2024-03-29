const { network } = require("hardhat");
const { FhenixClient, EncryptionTypes, getPermit } = require("fhenixjs");

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();
//const { verify } = require("../utils/verify");
const { ethers, deployments } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // Initialize FhenixClient
  const client = new FhenixClient({ provider: ethers.provider });
  // when going for localhost or hardhat network we want to use a mock
  const tester = await deploy("SoulBound", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    network.name !== "hardhat" &&
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API
  ) {
    // Not verifying the contract as fhenix network does not support api verification rn
    //console.log("Verifying...");
    // dont
    //await verify(tester.address, []);
  } else {
    console.log(
      "Hardhat network detected or not verifying required, skipping verification."
    );
  }

  console.log("Contract deployed to address: " + tester.address);

  // Interact with the contract
  const contractInstance = await ethers.getContractAt(
    "SoulBound",
    tester.address
  );
  // Mint first
  let response0 = await contractInstance.mint(
    "0x5c6688532A27492DA6C534a37cedE11A86823152",
    1
  );
  console.log("Minted NFT");

  const eOption = await client.encrypt(638656385, EncryptionTypes.uint32);
  response0 = await contractInstance.addUserDOBDetails(
    "0x5c6688532A27492DA6C534a37cedE11A86823152",
    eOption
  );
  console.log("Added into nft");
  // trying to add again should failed
  const eOption1 = await client.encrypt(638656385, EncryptionTypes.uint32);
  response0 = await contractInstance.addUserDOBDetails(
    "0x5c6688532A27492DA6C534a37cedE11A86823152",
    eOption1
  );
  console.log("Txn Should fail");
};
