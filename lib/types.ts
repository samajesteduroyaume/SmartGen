export interface ContractOptions {
    name: string;
    symbol: string;
    premint: number;
    features: {
        mintable: boolean;
        burnable: boolean;
        pausable: boolean;
        ownable: boolean;
        permit: boolean;
        votes: boolean;
        flashMint: boolean;
    };
    security: {
        license: string; // e.g. MIT
        accessControl: "ownable" | "roles";
    };
    payment?: {
        mintPrice: number; // in ETH
        marketingFee: number; // % of transfer (ERC20 only)
    };
}

export interface ERC721Options extends ContractOptions {
    baseURI: string;
    features: ContractOptions['features'] & {
        enumerable: boolean;
        uriStorage: boolean;
    };
}

export interface DAOOptions {
    name: string;
    settings: {
        proposalThreshold: number;
        votingDelay: number;
        votingPeriod: number;
        quorumPercentage: number;
    };
    features: {
        timelock: boolean;
        bravoCompatible: boolean;
    };
    security: {
        license: string;
    };
}

export interface GeneratedContract {
    code: string;
    filename: string;
}
