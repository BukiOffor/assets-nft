// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Mermaid is ERC721URIStorage,Ownable{
    error UriNotMapped();
    error InsufficientMintFee();
    event nftMinted(address owner, uint tokenId);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public mintFee = 0;
    mapping(uint=>string) tokenURIs;

    constructor() ERC721("Mermaid","MRD"){
    }
  
    function safeMint() external payable  returns(uint tokenID) {
        if(msg.value < mintFee){
            revert InsufficientMintFee();
        }
        tokenID = _tokenIds.current();
        _safeMint(msg.sender,tokenID);
        if(createTokenURI(tokenID) != true){
            revert UriNotMapped();
            }
        emit nftMinted(msg.sender, tokenID);
        _tokenIds.increment();
    }
    
    //This is not a safe way to provide randomization
    function createTokenURI(uint256 tokenId)internal returns(bool pass){
        bytes32 randomByte = keccak256(abi.encodePacked(block.timestamp));
        uint number = uint8(randomByte[4]);
        uint randomNumber = number%100;
        string[] memory URIs = new string[](3);
        URIs[0] = "ipfs://QmTjyMMaXaPzQdfXXLDsvMLSmmEXSgswiGS4LbMbC23bjH";
        URIs[1] = "ipfs://QmTDjDXef8s1LcJ5apxyD3fNFrtSW8T4oNvRCbSPcAHCpq";
        URIs[2] = "ipfs://QmbxvxUofj6Uw6puGjNhZFGJn7PEdUp3t1ZpckWfeKtYQH";
        uint8[3] memory percentage = getArray();
        uint8 checker = 0;
        for(uint8 i = 0;i<percentage.length; i++){
            if(randomNumber > checker && randomNumber < percentage[i] ){
                tokenURIs[tokenId] = URIs[i];
                return true;
            }checker = percentage[i];     
        }
    }

    function tokenURI(uint tokenId) public view virtual override returns(string memory){
        return tokenURIs[tokenId];
    }

    function getArray() internal pure returns(uint8[3] memory){
        return [10, 40, 100];
    }    
      
    function setMintfee(uint newMintFee) public onlyOwner{
        mintFee = newMintFee;
    }   
}