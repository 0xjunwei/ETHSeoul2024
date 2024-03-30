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
  let admin = (await ethers.getSigners())[1];
  let clientAcc = (await ethers.getSigners())[2];
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
  let response0 = await contractInstance.mint(clientAcc.getAddress(), 1);
  console.log("Minted NFT");

  const eOption = await client.encrypt(638656385, EncryptionTypes.uint32);
  response0 = await contractInstance.addUserDOBDetails(
    clientAcc.getAddress(),
    eOption
  );
  console.log("Added DOB into nft");
  //adding admin
  response0 = await contractInstance.addAdmin(admin.getAddress());
  console.log("added admin");
  // admin to add medical data
  const eMedicalData = await client.encrypt(2, EncryptionTypes.uint8);
  const eLastExamineDate = await client.encrypt(
    638656385,
    EncryptionTypes.uint32
  );
  response0 = await contractInstance
    .connect(admin)
    .addMedicalData(clientAcc.getAddress(), eMedicalData, eLastExamineDate);

  console.log("Added medical data");
  // Let try to pull out the medical data from the sc
  // client has to grant permission first
  response0 = await contractInstance
    .connect(clientAcc)
    .approveViewingOfData(deployer);
  console.log("Approved the deployer to view the medical data");
  // Getting the permit
  // trying to get a permit and pull out details for privacy as the decryption of data will only happen on frontend not through the SC
  // this ensure only the requester gets the data
  const permit = await getPermit(tester.address, ethers.provider);
  client.storePermit(permit);
  const permission = client.extractPermitPermission(permit);
  response0 = await contractInstance.retrieveMedicalData(
    clientAcc.address,
    permission
  );
  const plaintext = client.unseal(tester.address, response0);
  // Inserted 2 above, should get back 2
  console.log("plaintext return: " + plaintext.toString());

  // Try to get user data as NON-approved indiv
  // revoking access
  /*response0 = await contractInstance
    .connect(clientAcc)
    .revokeViewingOfData(deployer);
  const permit1 = await getPermit(tester.address, ethers.provider);
  client.storePermit(permit1);
  const permission1 = client.extractPermitPermission(permit1);
  response0 = await contractInstance.retrieveMedicalData(
    clientAcc.address,
    permission1
  );
  const plaintext1 = client.unseal(tester.address, response0);
  console.log("should not return: " + plaintext1.toString());*/

  // Check if dob checker works
  response0 = await contractInstance.isAboveEighteen(clientAcc.getAddress());
  console.log("Is user above 18: " + response0.toString());
};
