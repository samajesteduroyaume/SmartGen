import { ERC1155Options } from "../types";

export const generateERC1155 = (options: ERC1155Options): string => {
    const imports = [
        "@openzeppelin/contracts/token/ERC1155/ERC1155.sol",
        "@openzeppelin/contracts/access/Ownable.sol"
    ];

    const inheritance = ["ERC1155", "Ownable"];

    if (options.features.mintable) {
        // Mintable usually implies access control, Ownable is already there.
    }

    if (options.features.burnable) {
        imports.push("@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol");
        inheritance.push("ERC1155Burnable");
    }

    if (options.features.pausable) {
        imports.push("@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol");
        imports.push("@openzeppelin/contracts/utils/Pausable.sol"); // Sometimes needed for the modifier
        inheritance.push("ERC1155Pausable");
    }

    if (options.features.supply) {
        imports.push("@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol");
        inheritance.push("ERC1155Supply");
    }

    if (options.features.updatableURI) {
        // We will add a setURI function
    }

    const functions: string[] = [];

    // Constructor
    functions.push(`    constructor() ERC1155("${options.baseURI}") Ownable(msg.sender) {}`);

    // URI Update
    if (options.features.updatableURI) {
        functions.push(`
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }`);
    }

    // Minting
    if (options.features.mintable) {
        functions.push(`
    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }`);

        functions.push(`
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }`);
    }

    // Overrides
    const overrides: string[] = [];
    if (options.features.pausable || options.features.supply) {
        // _update override required for these extensions in 5.x, but let's check standard compatibility.
        // For simplicity with standard wizard logic (which uses _update since 5.0)
        // Assuming OpenZeppelin 5.x structure for _update
        functions.push(`
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(${inheritance.filter(i => i !== "Ownable" && i !== "ERC1155" && (i === "ERC1155Pausable" || i === "ERC1155Supply")).join(", ") + (inheritance.some(i => i === "ERC1155Pausable" || i === "ERC1155Supply") ? ", ERC1155" : "")})
    {
        super._update(from, to, ids, values);
    }`);
    }


    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

${imports.map(i => `import "${i}";`).join("\n")}

contract ${options.name.replace(/\s+/g, "")} is ${inheritance.join(", ")} {
${functions.join("\n\n")}
}`;
};
