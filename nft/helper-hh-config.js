const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2 : "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane : "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId : "9982",
        callBackGasLimit : "500000",
        initialSupply : "500000000000000000000" 
    },
    31337: {
        name: "hardhat",
        gasLane : "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId : "9982",
        callBackGasLimit : "500000",
        initialSupply : "50000000000000000000000" 
    }
}

const frontEndContractsFile = "../client/constants/contractAddresses.json"
const frontEndAbiFile = "../client/constants/abi.json"
const developmentChains = ["hardhat",'localhost']

module.exports = {
    developmentChains,
    frontEndContractsFile,
    frontEndAbiFile,
    networkConfig
}