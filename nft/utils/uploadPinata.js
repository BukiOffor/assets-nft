const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path")
require("dotenv").config()


const apiKey = process.env.pinata_apiKey;
const apiSecret = process.env.pinata_apiSecret;
const pinata = new pinataSDK(apiKey, apiSecret);

async function storeImages(imagesFilePath){
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes(".JPG"))

    let responses = []
    console.log("Uploading to IPFS")
    for (const fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Love",
            value: 100,
            artist: "Alyson Maltese"
        },
    ],
}

const imagesLocation = "./images"

async function handleTokenUris() {
    // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
    // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
    // You could also look at pinata https://www.pinata.cloud/
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".JPG", "")
        tokenUriMetadata.description = `A beautiful ${tokenUriMetadata.name} mermaid!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

async function main(){
    await handleTokenUris()
}

main().catch((error)=>{
    console.log(error)
})

//module.exports = { storeImages, storeTokenUriMetadata }

