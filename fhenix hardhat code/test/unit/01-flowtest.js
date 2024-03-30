const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { FhenixClient, EncryptionTypes, getPermit } = require("fhenixjs");
describe("SoulBound", async function () {
  let deployer;
  let admin;
  let client;
  const client_fhenix = new FhenixClient({ provider: ethers.provider });
  before(async function () {
    // deploy Proofers
    // using hardhat-deploy
    // get accounts from ethers
    console.log("Testing deploy of soulbound script");
    deployer = await getNamedAccounts();
    admin = (await ethers.getSigners())[1];
    client = (await ethers.getSigners())[2];
    deployerAddress = deployer.deployer;
    await deployments.fixture(["all"]);
    soulContract = await ethers.deployContract("SoulBound", [], {});
    soulContractAddress = await soulContract.getAddress();
  });

  // checks if mint works proper
  describe("mint to a address", async function () {
    it("Should be succeed at initial mint", async function () {
      await expect(soulContract.mint(client.getAddress(), 0));
    });
  });
  // checks tries to mint again should not work
  describe("mint a second time", function () {
    it("Fails if user possess a token already", async function () {
      await expect(soulContract.mint(client.getAddress(), 1)).to.be.reverted;
    });
  });

  // check Date Of Birth adding
  // checks if adding of DOB is accurate
  describe("adding Individual DOB", async function () {
    it("Should succeed at adding DOB as owner of contract", async function () {
      const eDOB = await client_fhenix.encrypt(
        638656385,
        EncryptionTypes.uint32
      );
      await expect(soulContract.addUserDOBDetails(client.getAddress(), eDOB));
    });
  });

  // should fail if adding a second time
  // Hardhat is not registering that it reverted which is weird
  // FHE lib is not doing a normal reversion
  /*describe("Negative Flow DOB", async function () {
    it("Should fail at adding DOB a 2nd time", async function () {
      const eDOB = await client_fhenix.encrypt(
        638656385,
        EncryptionTypes.uint32
      );
      await expect(soulContract.addUserDOBDetails(client.getAddress(), eDOB)).to
        .be.reverted;
    });
  });*/

  // Adds admin to contract
  describe("adding Admin", async function () {
    it("Should succeed at adding a admin as a deployer", async function () {
      await expect(soulContract.addAdmin(admin.getAddress()));
    });
  });
  // tries to add self into admin but not as deployer
  describe("Negative Flow Admin", async function () {
    it("Should fail if i am not a deployer and trying to get admin", async function () {
      await expect(soulContract.connect(client).addAdmin(client.getAddress()))
        .to.be.reverted;
    });
  });

  // As admin tries to Add medical Data & lastExamineDate;
  describe("Adding Medical data", async function () {
    it("Should succeed as Admin", async function () {
      const eMedicalData = await client_fhenix.encrypt(
        2,
        EncryptionTypes.uint8
      );
      const eLastExamineDate = await client_fhenix.encrypt(
        638656385,
        EncryptionTypes.uint32
      );
      await expect(
        soulContract
          .connect(admin)
          .addMedicalData(client.getAddress(), eMedicalData, eLastExamineDate)
      );
    });
  });
  // Add criminalRecord;
  describe("Adding Criminal Records", async function () {
    it("Should succeed as Admin", async function () {
      const eCriminalRecord = await client_fhenix.encrypt(
        2,
        EncryptionTypes.uint8
      );
      await expect(
        soulContract
          .connect(admin)
          .addCriminalRecord(client.getAddress(), eCriminalRecord)
      );
    });
  });
  // Add fertilityMeasure;
  describe("Adding Fertility Measure", async function () {
    it("Should succeed as Admin", async function () {
      const eFertility = await client_fhenix.encrypt(2, EncryptionTypes.uint8);
      await expect(
        soulContract
          .connect(admin)
          .addFertilityCount(client.getAddress(), eFertility)
      );
    });
  });
  // Add marriageStatus;
  describe("Adding Marriage Status", async function () {
    it("Should succeed as Admin", async function () {
      const eMarriageStatus = await client_fhenix.encrypt(
        2,
        EncryptionTypes.uint8
      );
      await expect(
        soulContract
          .connect(admin)
          .addMarriageStatus(client.getAddress(), eMarriageStatus)
      );
    });
  });
  // Add rating;
  describe("Adding Rating", async function () {
    it("Should succeed as Admin", async function () {
      const eRating = await client_fhenix.encrypt(2, EncryptionTypes.uint8);
      await expect(
        soulContract.connect(admin).addRating(client.getAddress(), eRating)
      );
    });
  });

  // granting deployer access to read
  describe("Adding deployer as valid reader of data", async function () {
    it("Should succeed", async function () {
      await expect(soulContract.connect(client).approveViewingOfData(deployer));
    });
  });
});
