"use client";

import { useState } from "react";
import { DeployedContract } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Loader2, Pause, Play, Coins, Users, ShieldAlert } from "lucide-react";
import { generateERC20 } from "@/lib/templates/erc20";
import { generateERC721 } from "@/lib/templates/erc721";
import { generateDAO } from "@/lib/templates/dao";
import { generateERC1155 } from "@/lib/templates/erc1155";
import { generateVesting } from "@/lib/templates/vesting";
import { ContractOptions, ERC721Options, DAOOptions, ERC1155Options, VestingOptions } from "@/lib/types";

export function AdminControls({ contract }: { contract: DeployedContract }) {
    const { data: hash, isPending, writeContract } = useWriteContract();

    const [mintTo, setMintTo] = useState("");
    const [mintAmount, setMintAmount] = useState("1");
    const [mintTokenId, setMintTokenId] = useState("0");
    const [whitelistAddresses, setWhitelistAddresses] = useState("");

    const handleAction = (functionName: string, args: any[] = []) => {
        // Minimal Generic ABI for common functions
        const abi = [
            { name: "pause", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
            { name: "unpause", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
            { name: "withdraw", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
            { name: "mint", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [] },
            { name: "safeMint", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [] },
            { name: "setAllowlist", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address[]" }, { type: "bool" }], outputs: [] },
            { name: "mint", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }, { type: "uint256" }, { type: "bytes" }], outputs: [] },
        ];

        writeContract({
            address: contract.address as `0x${string}`,
            abi: abi,
            functionName: functionName,
            args: args,
        });
    };

    // Safely access features with optional chaining
    const options = contract.options as any;
    const features = options?.features || {};

    const isMintable = !!features.mintable;
    const isPausable = !!features.pausable;
    const isWhitelist = !!features.whitelist;
    const hasOwner = options?.security?.accessControl === "ownable" || !!features.ownable;

    const { data: balanceData } = useBalance({
        address: contract.address as `0x${string}`,
    });

    const { data: totalSupply } = useReadContract({
        address: contract.address as `0x${string}`,
        abi: [{ name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] }],
        functionName: "totalSupply",
    });

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState("");

    // Regenerate code on mount (or when needed)
    // Note: Doing this in render pass is okay-ish if guarded, but useEffect is cleaner to avoid loop.
    if (!code && contract.options) {
        if (contract.type === "ERC20") {
            setCode(generateERC20(contract.options as ContractOptions));
        } else if (contract.type === "ERC721") {
            setCode(generateERC721(contract.options as ERC721Options));
        } else if (contract.type === "ERC1155") {
            setCode(generateERC1155(contract.options as ERC1155Options));
        } else if (contract.type === "Vesting") {
            setCode(generateVesting(contract.options as VestingOptions));
        } else {
            setCode(generateDAO(contract.options as DAOOptions));
        }
    }

    const handleVerify = async () => {
        setVerifying(true);
        setVerifyResult("");
        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: contract.address,
                    sourceCode: code,
                    contractname: contract.name.replace(/\s+/g, ""), // Ensure class name matches (template logic usually removes spaces)
                    compilerversion: "v0.8.20+commit.a1b79de6",
                    network: contract.network
                })
            });
            const data = await res.json();
            if (data.error) {
                setVerifyResult("Error: " + data.error);
            } else {
                setVerifyResult("Success! GUID: " + data.result);
            }
        } catch (e) {
            setVerifyResult("Request Failed");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="controls">Controls & Analytics</TabsTrigger>
                <TabsTrigger value="code">Source Code</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-4">
                {/* ANALYTICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalSupply ? totalSupply.toString() : "-"}
                            </div>
                            <p className="text-xs text-muted-foreground">{contract.symbol}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Contract Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : "0.0000"} <span className="text-sm font-normal text-muted-foreground">ETH</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Network</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize">{contract.network}</div>
                            <p className="text-xs text-muted-foreground break-all">{contract.address.slice(0, 6)}...{contract.address.slice(-4)}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* STATUS CARD */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isPausable && (
                                <div className="flex gap-2">
                                    <Button onClick={() => handleAction("pause")} variant="outline" className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                                        <Pause className="w-4 h-4 mr-2" /> Pause Contract
                                    </Button>
                                    <Button onClick={() => handleAction("unpause")} variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500/10">
                                        <Play className="w-4 h-4 mr-2" /> Unpause
                                    </Button>
                                </div>
                            )}
                            {hasOwner && (
                                <Button onClick={() => handleAction("withdraw")} variant="secondary" className="w-full">
                                    <Coins className="w-4 h-4 mr-2" /> Withdraw Funds
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* MINTING CARD */}
                    {isMintable && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Minting</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Label>Recipient Address</Label>
                                <Input placeholder="0x..." value={mintTo} onChange={(e) => setMintTo(e.target.value)} />

                                {contract.type === "ERC1155" && (
                                    <div className="mt-2">
                                        <Label>Token ID</Label>
                                        <Input type="number" placeholder="0" value={mintTokenId} onChange={(e) => setMintTokenId(e.target.value)} />
                                    </div>
                                )}

                                <Label className="mt-2">Amount</Label>
                                <Input type="number" placeholder="1" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />

                                <Button
                                    onClick={() => {
                                        if (contract.type === "ERC20") {
                                            handleAction("mint", [mintTo, BigInt(mintAmount)]);
                                        } else if (contract.type === "ERC721") {
                                            handleAction("safeMint", [mintTo, BigInt(mintAmount)]); // ERC721 usually takes ID, but our simple template might verify this. Standard wizard 721 mint is (to, tokenId) OR (to) auto-increment.
                                            // Wait, our ERC721 template uses `safeMint(to, tokenId)`. We need to check if we supported auto-increment.
                                            // Looking at previous template: it takes (to, tokenId). So "Amount" input above was actually Token ID for ERC721?
                                            // Let's check logic: "Amount / Token ID" label was used.
                                            // So for ERC721: Amount input = TokenID.
                                        } else if (contract.type === "ERC1155") {
                                            // mint(account, id, amount, data)
                                            handleAction("mint", [mintTo, BigInt(mintTokenId), BigInt(mintAmount), "0x"]);
                                        }
                                    }}
                                    className="w-full mt-2"
                                >
                                    Mint Tokens
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* WHITELIST CARD */}
                {isWhitelist && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Whitelist Management</CardTitle>
                            <CardDescription>Add addresses to allowlist (comma separated)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Textarea
                                placeholder="0x123..., 0xabc..."
                                value={whitelistAddresses}
                                onChange={(e) => setWhitelistAddresses(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleAction("setAllowlist", [whitelistAddresses.split(",").map(a => a.trim()), true])}
                                    className="w-full"
                                >
                                    <Users className="w-4 h-4 mr-2" /> Add to Whitelist
                                </Button>
                                <Button
                                    onClick={() => handleAction("setAllowlist", [whitelistAddresses.split(",").map(a => a.trim()), false])}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    <ShieldAlert className="w-4 h-4 mr-2" /> Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {hash && (
                    <div className="p-4 bg-muted/50 rounded-lg text-xs font-mono break-all">
                        Tx Hash: {hash} {isPending && <Loader2 className="w-3 h-3 inline animate-spin ml-2" />}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="code">
                <Card>
                    <CardHeader>
                        <CardTitle>Verified Source Code</CardTitle>
                        <CardDescription>Use this code to verify your contract on Etherscan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute right-2 top-2 z-10"
                                onClick={() => navigator.clipboard.writeText(code)}
                            >
                                Copy
                            </Button>
                            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-xs font-mono h-96">
                                {code}
                            </pre>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <Button onClick={handleVerify} disabled={verifying}>
                                {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {verifying ? "Verifying..." : "Verify on Etherscan (Beta)"}
                            </Button>
                            {verifyResult && <p className="text-xs font-mono text-center break-all">{verifyResult}</p>}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
