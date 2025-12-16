import { DAOOptions } from "../types";

export function generateDAO(options: DAOOptions): string {
    const imports = [
        "@openzeppelin/contracts/governance/Governor.sol",
        "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol",
        "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol",
        "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol",
    ];
    const inheritance = ["Governor", "GovernorSettings", "GovernorCountingSimple", "GovernorVotes"];
    const constructorArgs = [`IVotes _token`];

    // GovernorSettings(votingDelay, votingPeriod, proposalThreshold)
    // We can hardcode specific initial values or pass them. 
    // Using simple approach: Settings are initialized in constructor body or via super() call if updated OZ 5.x allows or requires.
    // OZ 5.x GovernorSettings constructor takes (delay, period, threshold)

    const superCalls = [
        `Governor("${options.name}")`,
        `GovernorSettings(${options.settings.votingDelay} /* 1 day */, ${options.settings.votingPeriod} /* 1 week */, ${options.settings.proposalThreshold})`,
        `GovernorVotes(_token)`
    ];

    if (options.features.timelock) {
        imports.push("@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol");
        inheritance.push("GovernorTimelockControl");
        constructorArgs.push("TimelockController _timelock");
        superCalls.push(`GovernorTimelockControl(_timelock)`);
    }

    const functions: string[] = [];

    // Overrides
    const overrides = ["Governor", "GovernorSettings", "GovernorVotes"];
    if (options.features.timelock) overrides.push("GovernorTimelockControl");

    functions.push(`
    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(${overrides.filter(x => x === "Governor" || x === "GovernorSettings").join(", ")})
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(${overrides.filter(x => x === "Governor" || x === "GovernorSettings").join(", ")})
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(${overrides.filter(x => x === "Governor" || x === "GovernorVotes").join(", ")})
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }
    `);

    // State, ProposalThreshold
    functions.push(`
    function state(uint256 proposalId)
        public
        view
        override(${overrides.filter(x => x === "Governor" || x === "GovernorTimelockControl").join(", ")})
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(${overrides.filter(x => x === "Governor" || x === "GovernorSettings").join(", ")})
        returns (uint256)
    {
        return super.proposalThreshold();
    }
    `);

    if (options.features.timelock) {
        functions.push(`
    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
         `);
    }

    // Constructor
    return `// SPDX-License-Identifier: ${options.security.license}
pragma solidity ^0.8.20;

${imports.map((i) => `import "${i}";`).join("\n")}

contract ${options.name.replace(/\s+/g, "")} is ${inheritance.join(", ")} {
    constructor(${constructorArgs.join(", ")})
        ${superCalls.join("\n        ")}
    {}

${functions.join("\n")}
}
`;
}
