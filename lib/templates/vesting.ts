import { VestingOptions } from "../types";

export const generateVesting = (options: VestingOptions): string => {
    // OpenZeppelin VestingWallet (Finance)
    // Constructor(address beneficiaryAddress, uint64 startTimestamp, uint64 durationSeconds)

    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

contract MyVesting is VestingWallet {
    constructor() VestingWallet(${options.beneficiary}, ${options.start}, ${options.duration}) {}
}`;
};
