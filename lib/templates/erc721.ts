import { ERC721Options } from "../types";

export function generateERC721(options: ERC721Options): string {
    const imports = ["@openzeppelin/contracts/token/ERC721/ERC721.sol"];
    const inheritance = ["ERC721"];
    const constructorArgs = [`"${options.name}"`, `"${options.symbol}"`];
    const constructorBody: string[] = [];
    const functions: string[] = [];

    // Handle Features
    if (options.features.burnable) {
        imports.push("@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol");
        inheritance.push("ERC721Burnable");
    }

    if (options.features.pausable) {
        imports.push("@openzeppelin/contracts/security/Pausable.sol");
        inheritance.push("Pausable");
        functions.push(`
      function pause() public onlyOwner {
          _pause();
      }
  
      function unpause() public onlyOwner {
          _unpause();
      }
      `);
    }

    if (options.features.enumerable) {
        imports.push("@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol");
        inheritance.push("ERC721Enumerable");
    }

    if (options.features.uriStorage) {
        imports.push("@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol");
        inheritance.push("ERC721URIStorage");
    }

    // Minting Logic
    if (options.payment && options.payment.mintPrice > 0) {
        // Auto-Increment + Paid Mint
        const priceInWei = (options.payment.mintPrice * 1e18).toLocaleString('fullwide', { useGrouping: false }).split('.')[0];

        // State variables (ugly placement but valid solidity)
        functions.push(`
    uint256 private _nextTokenId;
    uint256 public constant MINT_PRICE = ${priceInWei};

    function publicMint(uint256 qty) public payable {
        require(msg.value >= MINT_PRICE * qty, "Insufficient funds");
        for(uint256 i = 0; i < qty; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
        }
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    `);

    } else if (options.features.mintable) {
        functions.push(`
      function safeMint(address to, uint256 tokenId${options.features.uriStorage ? ", string memory uri" : ""}) public onlyOwner {
          _safeMint(to, tokenId);
          ${options.features.uriStorage ? "_setTokenURI(tokenId, uri);" : ""}
      }
      `);
    }

    if (options.features.ownable || options.security.accessControl === "ownable") {
        imports.push("@openzeppelin/contracts/access/Ownable.sol");
        inheritance.push("Ownable");
        constructorArgs.push("msg.sender");
    }

    // Overrides required by Solidity
    if (options.features.enumerable || options.features.uriStorage || options.features.pausable) {
        // Build overrides logic similar to Wizard
        // Simple heuristic for MVP
        const updateOverrides = ["ERC721"];
        if (options.features.enumerable) updateOverrides.push("ERC721Enumerable");
        if (options.features.pausable) updateOverrides.push("ERC721Pausable");

        functions.push(`
    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(${updateOverrides.join(", ")})
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(${updateOverrides.join(", ")})
    {
        super._increaseBalance(account, value);
    }
        `);

        if (options.features.uriStorage) {
            functions.push(`
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
             `);
        }

        if (options.features.enumerable) {
            functions.push(`
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable${options.features.uriStorage ? ", ERC721URIStorage" : ""})
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
             `);
        } else if (options.features.uriStorage) {
            functions.push(`
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
             `);
        }

    }

    // Construct the file
    return `// SPDX-License-Identifier: ${options.security.license}
pragma solidity ^0.8.20;
  
${imports.map((i) => `import "${i}";`).join("\n")}
  
contract ${options.name.replace(/\s+/g, "")} is ${inheritance.join(", ")} {
    constructor(${options.security.accessControl === "ownable" ? "address initialOwner" : ""})
        ERC721("${options.name}", "${options.symbol}")
        ${options.security.accessControl === "ownable" ? "Ownable(initialOwner)" : ""}
    {
${constructorBody.join("\n        ")}
    }
  
${functions.join("\n")}
}
`;
}
