const { ethers , upgrades } = require("hardhat");

const main = async ()=>{
    // const initialSupply = ethers.utils.parseEther("100000")
    const [deployer] = await ethers.getSigners();
    console.log("deployers",deployer.address)
    const Buy = await ethers.getContractFactory("NFT");
    console.log("deploy Buy",Buy)

    const buy = await upgrades.deployProxy(Buy, ["0xd55afcf4E872579CC6C0A8Cc3aa1950cC5237945","PUNEET", "PUN"]  ,{ initializer: 'initialize' });
    console.log("nnnnnnnnnnnnnnnnnnnnn")
    await buy.deployed();
    console.log("mmmmmmmmmmmmmmmmmmmmmmm")


    console.log('Buy deployed to:', buy.address);

    // const contract = await buy.deploy(initialSupply);
    // console.log("address of contract",contract.address)
}
main()
.then(() => process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});