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
        capped: boolean; // ERC20 only
    };
    security: {
        license: string; // e.g. MIT
        accessControl: "ownable" | "roles";
    };
    cap?: number; // Max Supply for ERC20
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
        royalties: boolean; // ERC721 only
        whitelist: boolean; // ERC721 only (Simple mapping)
    };
    royaltyBps?: number; // Basis points (e.g. 500 = 5%)
}

export interface ERC1155Options {
    name: string;
    baseURI: string;
    features: {
        mintable: boolean;
        burnable: boolean;
        pausable: boolean;
        supply: boolean; // ERC1155Supply
        updatableURI: boolean;
        ownable: boolean;
    };
    security: {
        accessControl: "ownable" | "roles";
    };
}

export interface VestingOptions {
    beneficiary: string;
    start: number; // Timestamp
    duration: number; // Seconds
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
