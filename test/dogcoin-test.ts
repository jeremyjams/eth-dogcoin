import { expect } from "chai";
import { ethers } from "hardhat";
import { upgrades } from "hardhat";
//const { ethers, upgrades } = require("hardhat");


import { Signer } from "ethers";

import { DogCoin, DogCoin__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("DogCoin", function () {

    //let accounts: Signer[];
    let accountOne: SignerWithAddress 
    let accountTwo: SignerWithAddress
    let dogCoin: DogCoin

    beforeEach("Fresh contract & accounts", async () => {
        [accountOne, accountTwo] = await ethers.getSigners();
        const dogCoinFactory: DogCoin__factory = await ethers.getContractFactory("DogCoin")
        dogCoin = await dogCoinFactory.deploy();
        //dogCoin = await  upgrades.deployProxy(dogCoinFactory)
        await dogCoin.deployed();
    });

    it('should put 1000 DogCoin in the first account', async () => {
        const balance = await dogCoin.balanceOf(accountOne.address);
        expect(balance).to.equal(1000, "1000 wasn't in the first account");
        const holdersLength = await dogCoin.getTotalHolders();
        console.log(holdersLength.toString());
        const holder = await dogCoin.holders(0);
        expect(holder).to.equal(accountOne.address, "first account is not in holders array")
    });

    it('should transfer coin correctly', async () => {
        // Get initial balance of second account.
        const initBalance = await dogCoin.balanceOf(accountTwo.address);
        expect(initBalance).to.equal(0, "second account balance wasn't empty");

        // Get first holder
        const holderOne = await dogCoin.holders(0);
        console.log(holderOne)
        expect(holderOne).to.equal(accountOne.address, "first holder is not accountOne");

        // Transfer
        await expect(dogCoin.connect(accountOne).transfer(accountTwo.address, 1000))
            .to.emit(dogCoin, 'AddedHolder')
            .withArgs(accountTwo.address)
            .to.emit(dogCoin, 'RemovedHolder')
            .withArgs(accountOne.address)

        // Get final balance of second account.
        const balance = await dogCoin.balanceOf(accountTwo.address);
        expect(balance).to.equal(1000, "1000 wasn't in the second account");

        // Verify accountTwo is relocated to holder#1
        const holderOneNew = await dogCoin.holders(0);
        console.log(holderOneNew)
        expect(holderOneNew).to.equal(accountTwo.address, "first holder is not accountTwo");
        const firstHolderIndex = await dogCoin.getHolderIndexOf(accountTwo.address);
        expect(firstHolderIndex).to.equal(1, "second account is not holder#1");
    });

});
