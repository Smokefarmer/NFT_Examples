// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFTContract is ERC721, Ownable {
    using Strings for uint256;

    uint256 public totalSupply;

    constructor() ERC721("FhTechnikum", "FHT") {
    }

    function mint(uint256 _numTokens) external payable {
        uint256 curTotalSupply = totalSupply;
        for(uint256 i = 1; i <= _numTokens; ++i) {
            _safeMint(msg.sender, curTotalSupply + i);
        }
        totalSupply += _numTokens;
    }
}