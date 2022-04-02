const { ethers } = require("hardhat")

const main = async ()=>{
    const initialSupply = ethers.utils.parseEther("100000")
    const [deployer] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("Token");
    const contract = await tokenFactory.deploy(initialSupply);
    console.log("address of contract",contract.address)
}
main()
.then(() => process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});