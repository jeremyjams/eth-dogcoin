// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
//import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";


contract DogCoinV2 is
    ERC20Upgradeable
    //ERC20
    //,Ownable
    //Initializable
    //UUPSUpgradeable
{
    event AddedHolder(address indexed account);
    event RemovedHolder(address indexed account);

    mapping(address => uint256) public holderIndexes; //Holder#1, Holder#2 (index starts at 1)
    address[] public holders; //TODO rename to holderAccounts

    //it's common to move constructor logic to an
    // external initializer function, usually called `initialize`
    function initialize() public initializer {
        __ERC20_init("dogcoinv2", "DOG2");

        _mint(msg.sender, 1000);

        // holder is new, should subscribe to array
        holders.push(msg.sender);
        holderIndexes[msg.sender] = holders.length;
        emit AddedHolder(msg.sender);
    }

}
