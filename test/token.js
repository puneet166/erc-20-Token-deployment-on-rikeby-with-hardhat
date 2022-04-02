const { expect } = require("chai");
const { ethers } = require("hardhat"); //The ethers variable is available in the global scope. If you like your code always being explicit, you can add this line at the top:


describe("Token.sol", () => {
    let contractFactory;
    let contract;
    let owner;
    let alice;
    let bob;
    let initialSupply;
    let ownerAddress;
    let aliceAddress;
    let bobAddress;

    beforeEach(async () => {
        [owner, alice, bob] = await ethers.getSigners(); //A Signer in ethers.js is an object that represents an Ethereum account. It's used to send transactions to contracts and other accounts. Here we're getting a list of the accounts in the node we're connected to, which in this case is Hardhat Network, and only keeping the first one.
        initialSupply = ethers.utils.parseEther("100000");
        contractFactory = await ethers.getContractFactory("Token"); //A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts, so Token here is a factory for instances of our token contract.
        contract = await contractFactory.deploy(initialSupply); //Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract. This is the object that has a method for each of your smart contract functions.
        ownerAddress = await owner.getAddress();//Once the contract is deployed, we can call our contract methods on hardhatToken and use them to get the balance of the owner account by calling balanceOf().
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress();
    });

    describe("Correct setup", () => {
        it("should be named 'MyToken", async () => {
            const name = await contract.name();
            expect(name).to.equal("MyToken");
        });
        it("should have correct supply", async () => {
            const supply = await contract.getTotalSupply();
            expect(supply).to.equal(initialSupply);
        });
        it("owner should have all the supply", async () => {
            const ownerBalance = await contract.balanceOf(ownerAddress);
            expect(ownerBalance).to.equal(initialSupply);
        });
    });

    describe("Core", () => {
        it("owner should transfer to Alice and update balances", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            let aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(0);
            await contract.transfer(transferAmount, aliceAddress);
            aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(transferAmount);
        });
        it("owner should transfer to Alice and Alice to Bob", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            await contract.transfer(transferAmount, aliceAddress); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(0);
            await contract.connect(alice).transfer(transferAmount, bobAddress);
            bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(transferAmount);
        });
        it("should fail by depositing more than current balance", async () => {
            const txFailure = initialSupply + 1;
            await expect(contract.transfer(txFailure, aliceAddress)).to.be.revertedWith("Not enough funds");
        });
    });
});