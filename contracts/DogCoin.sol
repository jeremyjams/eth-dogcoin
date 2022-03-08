// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract DogCoin is
    ERC20
    //ERC20Upgradeable
{
    event AddedHolder(address indexed account);
    event RemovedHolder(address indexed account);

    mapping(address => uint256) public holderIndexes; //Holder#1, Holder#2 (index starts at 1)
    address[] public holders; //TODO rename to holderAccounts

    constructor() ERC20("dogcoin", "DOG") {
        _mint(msg.sender, 1000);

        // holder is new, should subscribe to array
        holders.push(msg.sender);
        holderIndexes[msg.sender] = holders.length;
        emit AddedHolder(msg.sender);
    }

    /*
    function initialize() public initializer {
        __ERC20_init("dogcoin", "DOG");

        _mint(msg.sender, 1000);

        // holder is new, should subscribe to array
        holders.push(msg.sender);
        holderIndexes[msg.sender] = holders.length;
        emit AddedHolder(msg.sender);
    }
    */

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        super.transfer(to, amount);

        if (holderIndexes[to] == 0) {
            // holder is new, should subscribe to array
            holders.push(to);
            holderIndexes[to] = holders.length;
            emit AddedHolder(to);
        }

        if (balanceOf(msg.sender) == 0) {
            // sender is broke, should remove it from holder lists
            uint256 freeIndex = holderIndexes[msg.sender];
            holders[freeIndex - 1] = holders[holders.length - 1]; //relocate last holder to now-free slot
            holders.pop(); // delete previous holder from tail (ensures no duplicate)
            holderIndexes[to] = freeIndex; //store new index of relocated holder
            emit RemovedHolder(msg.sender);
        }

        console.log("Transferred to: ", to);
        return true;
    }

    /*
    function mint(address account, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        _mint(account, amount);
        if (holderIndexes[account] == 0) {
            // holder is new, should subscribe to array
            holders.push(account);
            holderIndexes[account] = holders.length;
            emit AddedHolder(account);
        }
        return true;
    }
    */

    function getTotalHolders() public view returns (uint256) {
        return holders.length;
    }

    function getHolderIndexOf(address account) public view returns (uint256) {
        return holderIndexes[account];
    }
}
