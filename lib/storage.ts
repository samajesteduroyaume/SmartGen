import { ContractOptions, ERC721Options, DAOOptions, ERC1155Options, VestingOptions } from "./types";

export interface DeployedContract {
    id: string;
    name: string;
    symbol: string;
    address: string;
    network: string;
    type: "ERC20" | "ERC721" | "ERC1155" | "DAO" | "Vesting";
    date: string;
    txHash: string;
    options: ContractOptions | ERC721Options | ERC1155Options | DAOOptions | VestingOptions;
}

const STORAGE_KEY = "smartgen_contracts";

export const saveContract = (contract: DeployedContract) => {
    if (typeof window === "undefined") return;
    const existing = getContracts();
    const updated = [contract, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getContracts = (): DeployedContract[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse contracts", e);
        return [];
    }
};

export const deleteContract = (id: string) => {
    if (typeof window === "undefined") return;
    const existing = getContracts();
    const updated = existing.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
