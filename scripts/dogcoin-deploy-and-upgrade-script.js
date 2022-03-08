// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const DogCoin = await ethers.getContractFactory("DogCoin");

    //const dogCoin = await DogCoin.deploy();
    const dogCoin = await  upgrades.deployProxy(DogCoin)
    await dogCoin.deployed();

    console.log("DogCoin deployed to:", dogCoin.address);

    const DogCoinV2 = await ethers.getContractFactory("DogCoinV2"); //let's say it's DogCoinV2 here

    const dogCoinv2 = await upgrades.upgradeProxy(dogCoin.address, DogCoinV2);
    console.log("Box upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
