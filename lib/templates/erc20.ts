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

    // Capped (Max Supply)
    if (options.features.capped && options.cap && options.cap > 0) {
        imports.push("@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol");
        inheritance.push("ERC20Capped");
        // ERC20Capped constructor requires cap * 10^decimals
        // We assume 18 decimals for simplicity in this generator or use decimals()
        // But constructor runs before decimals() override? No, decimals is virtual.
        // Standard OZ ERC20Capped constructor argument is uint256 cap. 
        // We will pass it in the constructor of our contract to the parent.
        constructorBody.unshift(`// Max Supply defined in constructor for ERC20Capped`);
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

    // Update Override for Capped
    // ERC20Capped requires overriding _update (OZ 5.x) or _mint (OZ 4.x)
    // Assuming OZ 5.x we need to override _update
    if (options.features.capped) {
        // If we already have _update from Pausable, we need to merge
        // Find if we added _update already
        const existingUpdateIndex = functions.findIndex(f => f.includes("function _update"));
        if (existingUpdateIndex >= 0) {
            // Replace existing _update to include ERC20Capped
            functions[existingUpdateIndex] = functions[existingUpdateIndex].replace(
                /override\(ERC20.*?\)/,
                `override(ERC20${options.features.pausable ? ", ERC20Pausable" : ""}, ERC20Capped)`
            );
        } else {
            // Add new _update
            functions.push(`
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
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
        ERC20("${options.name}", "${options.symbol}")
        ${options.security.accessControl === "ownable" ? "Ownable(initialOwner)" : ""}
        ${options.features.capped && options.cap ? `ERC20Capped(${options.cap} * 10 ** decimals())` : ""}
    {
${constructorBody.join("\n        ")}
    }

${functions.join("\n")}
}
`;
}

