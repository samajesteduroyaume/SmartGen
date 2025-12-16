"use client";

import { useEffect, useState } from "react";
import { DeployedContract, getContracts, deleteContract } from "@/lib/storage";
import { Plus, LayoutDashboard, Copy, Trash2, ExternalLink, Box, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminControls } from "@/components/admin-controls";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const dict = dictionary.dashboard;
    const [contracts, setContracts] = useState<DeployedContract[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating a short delay for better UX (prevent flickering if instant)
        const timer = setTimeout(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setContracts(getContracts());
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to remove this contract from your list? It will remain on the blockchain.")) {
            deleteContract(id);
            setContracts(getContracts());
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                        {dict.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">{dict.welcome}</p>
                </div>
                <Link href={`/${lang}/generator`}>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> {dict.create_first}
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-border/50 pb-2">{dict.my_contracts}</h2>

                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card border border-border/50 rounded-xl p-5 h-[200px] animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-muted"></div>
                                    <div className="w-8 h-8 rounded-md bg-muted"></div>
                                </div>
                                <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                                <div className="w-1/4 h-4 bg-muted rounded mb-4"></div>
                                <div className="w-full h-px bg-muted/50 mt-auto mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="w-1/3 h-3 bg-muted rounded"></div>
                                    <div className="w-1/4 h-3 bg-muted rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : contracts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {contracts.map((contract) => (
                            <div key={contract.id} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors group relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {contract.type === "ERC20" ? "20" : contract.type === "ERC721" ? "721" : "DAO"}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={() => navigator.clipboard.writeText(contract.address)}
                                            title="Copy Address"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(contract.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold truncate" title={contract.name}>{contract.name}</h3>
                                <div className="text-sm font-mono text-muted-foreground mb-4">{contract.symbol}</div>

                                {/* Manage Button */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full mb-4">
                                            <Settings className="w-4 h-4 mr-2" /> Manage Contract
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl bg-background border-border">
                                        <DialogHeader>
                                            <DialogTitle>Mange Only {contract.name}</DialogTitle>
                                            <DialogDescription>
                                                Interact with your deployed contract directly. Ensure you are connected with the owner wallet.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <AdminControls contract={contract} />
                                    </DialogContent>
                                </Dialog>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/30">
                                    <span>{new Date(contract.date).toLocaleDateString()}</span>
                                    <a
                                        href={`https://${contract.network === "mainnet" ? "" : contract.network + "."}etherscan.io/address/${contract.address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"
                                    >
                                        {contract.network} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mb-6">
                            <Box className="w-10 h-10 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{dict.no_contracts}</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm">
                            You haven't deployed any smart contracts yet. Start by creating your first token or NFT collection.
                        </p>
                        <Link href={`/${lang}/generator`}>
                            <Button size="lg" className="gap-2 shadow-xl shadow-primary/20">
                                <Plus className="w-5 h-5" /> {dict.create_first}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
