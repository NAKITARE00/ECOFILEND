// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    string constant TOKEN_URI =
        "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeih6maphvuhjdfeil43owxf5ozysqp3zhqs5zhy2oe3mpbmej4pmda/eco.png";
    uint256 internal tokenId;

    constructor() ERC721("STAKENFT", "STAKENFT") {}

    function mint(address to) public {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, TOKEN_URI);
        unchecked {
            tokenId++;
        }
    }
}
