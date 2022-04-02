const { ethers } = require("hardhat")

const main = async ()=>{
    const initialSupply = ethers.utils.parseEther("100000")
    const [deployer] = await ethers.getSigners();
    console.log("deployers",deployer)
    const tokenFactory = await ethers.getContractFactory("Token");
    console.log("tokenFactory",tokenFactory)
    const contract = await tokenFactory.deploy(initialSupply);
    console.log("address of contract",contract.address)
}
main()
.then(() => process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});