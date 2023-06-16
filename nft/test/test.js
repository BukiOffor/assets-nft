const {assert,expect} = require("chai");
const {network,deployments,ethers,getNamedAccounts} = require('hardhat');
const {developmentChains} = require("../helper-hh-config");


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT unit test", ()=>{
        let mermaid ,deployer;
        const chainId = network.config.chainId;
        beforeEach(async ()=>{
            deployer = await (getNamedAccounts()).deployer;
            await deployments.fixture();
            mermaid = await ethers.getContract("Mermaid",deployer);
        })

        describe("Constructor",()=>{
            const owner = mermaid.owner();
            assert.equal(deployer,owner);
        })


    })