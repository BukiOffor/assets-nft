const {assert,expect} = require("chai");
const {network,deployments,ethers,getNamedAccounts} = require('hardhat');
const {developmentChains} = require("../helper-hh-config");


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT unit test", ()=>{
        let mermaid ,deployer, signer;
        const chainId = network.config.chainId;
        beforeEach(async ()=>{
            deployer = await (getNamedAccounts()).deployer;
            await deployments.fixture();
           //const myContract = await deployments.get('Mermaid');
            //mermaid = await ethers.getContractAt("Mermaid",myContract.address,deployer);
            mermaid = await ethers.getContract("Mermaid",deployer)
            signer = await ethers.getSigner(6)          
        })

        describe("setMintFee", async()=>{
            it("should revert if its called by not contract Owner", async()=>{
                //const accounts = await ethers.getSigners();
                //const signer = accounts[3];
                //const contract = await ethers.getContract("Mermaid");
                const contract = await mermaid.connect(signer);
                await expect(contract.setMintfee(100000)).to.be.reverted
            })
            it("should pass if its called by contract owner", async()=>{
                await expect(mermaid.setMintfee(10000000)).not.to.be.reverted
            })
        })

        describe("safeMint",async()=>{
            let contract;
            beforeEach(async()=>{
                contract =  await mermaid.connect(signer);
                const receipt = await mermaid.setMintfee(ethers.utils.parseEther("1"));
                receipt.wait(1)
            })

            it("should not mint if mint fee is not paid", async()=>{
                await expect(contract.safeMint({value:ethers.utils.parseEther("0.9")})).to.be.revertedWithCustomError(contract, "InsufficientMintFee")
            })

            it("should mint if mint fee is paid", async()=>{
                await expect(contract.safeMint({value:ethers.utils.parseEther("1")})).not.to.be.reverted;
            })
            it("should emit event when nft is minted", async()=>{
                await expect(contract.safeMint({value:ethers.utils.parseEther("1")})).to.emit(contract,"nftMinted")
            })
        })
        

    })