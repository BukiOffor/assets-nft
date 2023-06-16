const {ethers, getNamedAccounts} = require("hardhat")

const Nftaddress = "0x8D800a0879f70b47b1e0a8c4797684E8Ae734eDf";
async function main(){
    const {deployer} = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer)
    const mermaid = await ethers.getContractAt("Mermaid",Nftaddress,signer);
    const response = await mermaid.safeMint();
    const receipt = await response.wait(1);
    await new Promise(async (resolve, reject) => {
    setTimeout(() => reject("Timeout: 'nftMinted' event did not fire"), 300000) // 5 minute timeout time
    // setup listener for our event
    mermaid.once("nftMinted", async () => {
        console.log(`Random Mermaid NFT index 0 tokenURI: ${await mermaid.tokenURI(0)}`)
        resolve()
    })
})
}

main().catch((error)=>{
    console.log(error);
})
