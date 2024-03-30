// scripts/interactWithSoulBound.js

const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();
const { FhenixClient, EncryptionTypes, getPermit } = require("fhenixjs");

async function main() {
  // Modify accordingly to match current deployment address
  const contractAddress = "0x0cC63D06fB5882e8dE85FA259010414d0461B6f4";

  const contractArtifact = await hre.artifacts.readArtifact("SoulBound");

  // Get signer accounts
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const admin = signers[1];
  const clientAcc = signers[3];

  // Connect to the deployed contract
  const contract = new ethers.Contract(
    contractAddress,
    contractArtifact.abi,
    admin
  );
  // Mint first
  //let response = await contract.connect(deployer).mint(clientAcc.getAddress(), 0);

  const client = new FhenixClient({ provider: ethers.provider });
  const eOption = await client.encrypt(638656385, EncryptionTypes.uint32);
  response0 = await contract
    .connect(admin)
    .addUserDOBDetails(clientAcc.getAddress(), eOption);
  console.log("Added DOB details to the contract.");
  // During deployment admin is already added to contract this no need for additional
  // admin to add medical data
  const eMedicalData = await client.encrypt(2, EncryptionTypes.uint8);
  const eLastExamineDate = await client.encrypt(
    638656385,
    EncryptionTypes.uint32
  );
  response0 = await contract
    .connect(admin)
    .addMedicalData(clientAcc.getAddress(), eMedicalData, eLastExamineDate);
  console.log("Added Medical data");

  // admin to add criminalRecord
  const eCriminalRecord = await client.encrypt(2, EncryptionTypes.uint8);
  response0 = await contract
    .connect(admin)
    .addCriminalRecord(clientAcc.getAddress(), eCriminalRecord);
  console.log("Added Criminal Record data");

  // admin to add Fertility Count
  const eFertilityCount = await client.encrypt(98, EncryptionTypes.uint8);
  response0 = await contract
    .connect(admin)
    .addFertilityCount(clientAcc.getAddress(), eFertilityCount);
  console.log("Added Fertility data");

  // admin to add Marriage Status
  const eMarriageStatus = await client.encrypt(2, EncryptionTypes.uint8);
  response0 = await contract
    .connect(admin)
    .addMarriageStatus(clientAcc.getAddress(), eMarriageStatus);
  console.log("Added Marriage Status data");

  // admin to add Rating
  const eRating = await client.encrypt(100, EncryptionTypes.uint8);
  response0 = await contract
    .connect(admin)
    .addRating(clientAcc.getAddress(), eRating);
  console.log("Added User rating");
  // client has to grant permission first
  // client has to grant permission first
  response0 = await contract.connect(clientAcc).approveViewingOfData(deployer);
  console.log("Approved the deployer to view the medical data");
  // Getting the permit
  // trying to get a permit and pull out details for privacy as the decryption of data will only happen on frontend not through the SC
  // this ensure only the requester gets the data
  const permit = await getPermit(contractAddress, ethers.provider);
  client.storePermit(permit);
  const permission = client.extractPermitPermission(permit);
  response0 = await contract
    .connect(deployer)
    .retrieveMedicalData(clientAcc.getAddress(), permission);
  const plaintext = client.unseal(contractAddress, response0);
  // Inserted 2 above, should get back 2
  console.log("plaintext return: " + plaintext.toString());

  // Check if dob checker works
  response0 = await contract.isAboveEighteen(clientAcc.getAddress());
  console.log("Is user above 18: " + response0.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
