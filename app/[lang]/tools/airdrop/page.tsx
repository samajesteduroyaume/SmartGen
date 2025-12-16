"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";
import { Loader2, Send } from "lucide-react";
import { parse } from "path";

export default function AirdropPage() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amount, setAmount] = useState("1"); // Fixed amount for now for simplicity
    const [status, setStatus] = useState("");

    const { writeContractAsync, isPending } = useWriteContract();

    const handleAirdrop = async () => {
        setStatus("Starting Airdrop...");
        const lines = recipients.split("\n").filter(l => l.trim() !== "");
        const addresses = lines.map(l => l.trim()).filter(l => isAddress(l));

        if (addresses.length === 0) {
            setStatus("No valid addresses found.");
            return;
        }

        setStatus(`Found ${addresses.length} addresses. Sending...`);

        // Batch Send Logic (Client Side Loop for simplicity without custom contract)
        // Ideally we use a Disperse Contract, but for "No Code" tool we can just loop or use a simple Multicall if we had one.
        // Let's do a simple loop for V5 MVP.

        let successCount = 0;
        for (const addr of addresses) {
            try {
                // Determine if ERC20 or ERC721? 
                // We'll assume ERC20 transfer(to, amount) for now.
                // Standard ERC20 Transfer
                await writeContractAsync({
                    address: tokenAddress as `0x${string}`,
                    abi: [{ name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }] }],
                    functionName: "transfer",
                    args: [addr, parseEther(amount)],
                });
                successCount++;
                setStatus(`Sent ${successCount}/${addresses.length}...`);
            } catch (e) {
                console.error(e);
                setStatus(`Error sending to ${addr}. Stopped.`);
                break;
            }
        }

        if (successCount === addresses.length) {
            setStatus("Airdrop Complete! ✅");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">🪂 Airdrop Tool</h1>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Bulk Token Sender</CardTitle>
                    <CardDescription>Send ERC20 tokens to multiple addresses (Beta: 1-by-1 mode).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Token Address (ERC20)</Label>
                        <Input placeholder="0x..." value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Amount per person</Label>
                        <Input type="number" placeholder="100" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Recipients (One address per line)</Label>
                        <Textarea
                            placeholder="0x123...&#10;0x456..."
                            className="h-48 font-mono"
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleAirdrop} disabled={isPending || !tokenAddress}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Start Airdrop
                    </Button>

                    {status && <p className="font-mono text-sm bg-muted p-2 rounded">{status}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
