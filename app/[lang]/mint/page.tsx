"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2, Wallet, Coins } from "lucide-react";
import { DeployedContract } from "@/lib/storage";

export default function MintPage() {
    const searchParams = useSearchParams();
    const address = searchParams.get("address");

    // In a real app, we would fetch contract metadata from our backend/DB using the address.
    // For this No-Code V5 demo, we will try to read generic ERC721 properties.

    const { data: name } = useReadContract({
        address: address as `0x${string}`,
        abi: [{ name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }],
        functionName: "name",
    });

    const { data: symbol } = useReadContract({
        address: address as `0x${string}`,
        abi: [{ name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }],
        functionName: "symbol",
    });

    const { writeContract, isPending, data: hash } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const [mintAmount, setMintAmount] = useState("1");

    const handleMint = () => {
        if (!address) return;
        // Generic SafeMint for ERC721 (assuming no payment for MVP, or we add value field later)
        // Note: Our template currently requires Owner to mint. This page assumes we updated the template or the user is the owner testing it.
        // real V5 would need a "publicMint" function in the template.
        writeContract({
            address: address as `0x${string}`,
            abi: [{ name: "safeMint", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [] }],
            functionName: "safeMint",
            args: [(window as any).ethereum?.selectedAddress, BigInt(mintAmount)], // Using generic cast for window
        });
    };

    if (!address) {
        return <div className="flex items-center justify-center h-screen">Invalid Contract Address</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/20 bg-slate-900 text-white">
                <CardHeader className="text-center">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-4xl">💎</span>
                    </div>
                    <CardTitle className="text-3xl">{name?.toString() || "Loading..."}</CardTitle>
                    <CardDescription className="text-slate-400">Mint your {symbol?.toString()} NFT now.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <ConnectButton showBalance={false} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Amount</span>
                            <span>{mintAmount} NFT</span>
                        </div>
                        <Input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={mintAmount}
                            onChange={(e) => setMintAmount(e.target.value)}
                            className="bg-slate-800"
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg font-bold py-6"
                        onClick={handleMint}
                        disabled={isPending || isConfirming}
                    >
                        {isPending || isConfirming ? <Loader2 className="animate-spin mr-2" /> : <Wallet className="mr-2" />}
                        {isConfirming ? "Minting..." : "Mint Now"}
                    </Button>

                    {isSuccess && (
                        <div className="p-4 bg-green-900/50 border border-green-500/50 rounded text-center text-green-200">
                            Mint Successful! 🎉
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-center border-t border-slate-800 pt-4">
                    <p className="text-xs text-slate-500">Powered by SmartGen Launchpad</p>
                </CardFooter>
            </Card>
        </div>
    );
}
