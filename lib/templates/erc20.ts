import { ContractOptions } from "../types";

export function generateERC20(options: ContractOptions): string {
    const imports = ["@openzeppelin/contracts/token/ERC20/ERC20.sol"];
    const inheritance = ["ERC20"];
    const constructorArgs = [`"${options.name}"`, `"${options.symbol}"`];
    const constructorBody: string[] = [];
    const functions: string[] = [];

    // Handle Features
    if (options.features.burnable) {
        imports.push("@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol");
        inheritance.push("ERC20Burnable");
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
        // Override _beforeTokenTransfer to check paused state - OpenZeppelin 4.x style or 5.x hooks
        // Assuming OpenZeppelin 5.x for modern contracts, use _update
        functions.push(`
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20${options.features.pausable ? ", ERC20Pausable" : ""})
    {
        super._update(from, to, value);
    }
    `);
    }

    // Public Mint (Payable)
    if (options.payment && options.payment.mintPrice > 0) {
        // Convert ETH price to Wei (avoid scientific notation)
        const priceInWei = (options.payment.mintPrice * 1e18).toLocaleString('fullwide', { useGrouping: false }).split('.')[0];

        functions.push(`
    uint256 public constant MINT_PRICE = ${priceInWei}; // ${options.payment.mintPrice} ETH

    function publicMint(address to, uint256 qty) public payable {
        require(msg.value >= MINT_PRICE * qty, "Insufficient funds");
        _mint(to, qty * 10 ** decimals());
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    `);
    } else if (options.features.mintable) {
        functions.push(`
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    `);
    }

    if (options.features.ownable || options.security.accessControl === "ownable") {
        imports.push("@openzeppelin/contracts/access/Ownable.sol");
        inheritance.push("Ownable");
        // OZ 5.x require initial owner in constructor
        constructorArgs.push("msg.sender");
    }

    // Premint
    if (options.premint > 0) {
        constructorBody.push(`_mint(msg.sender, ${options.premint} * 10 ** decimals());`);
    }

    // Construct the file
    return `// SPDX-License-Identifier: ${options.security.license}
pragma solidity ^0.8.20;

${imports.map((i) => `import "${i}";`).join("\n")}

contract ${options.name.replace(/\s+/g, "")} is ${inheritance.join(", ")} {
    constructor(${options.security.accessControl === "ownable" ? "address initialOwner" : ""})
        ERC20("${options.name}", "${options.symbol}")
        ${options.security.accessControl === "ownable" ? "Ownable(initialOwner)" : ""}
    {
${constructorBody.join("\n        ")}
    }

${functions.join("\n")}
}
`;
}

