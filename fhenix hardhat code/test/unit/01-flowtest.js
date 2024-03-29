const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { FhenixClient, EncryptionTypes, getPermit } = require("fhenixjs");

describe("SoulBound", async function () {
  let deployer;
  let admin;
  let client;
  const client_fhenix = new FhenixClient({ provider: ethers.provider });
  beforeEach(async function () {
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
      // Await the completion of the first mint operation.
      const receipt = await soulContract.mint(client.getAddress(), 0);
      await receipt.wait();

      await expect(soulContract.mint(client.getAddress(), 0)).to.be.reverted;
    });
  });

  // check Date Of Birth adding
  // checks if adding of DOB is accurate
  describe("adding Individual DOB", async function () {
    it("Should be succeed at adding DOB as owner of contract", async function () {
      const eDOB = await client_fhenix.encrypt(
        638656385,
        EncryptionTypes.uint32
      );
      await expect(soulContract.addUserDOBDetails(client.getAddress(), eDOB));
    });
  });
});
