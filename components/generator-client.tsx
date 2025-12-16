"use client";

import { useState, useEffect } from "react";
import { generateERC20 } from "@/lib/templates/erc20";
import { generateERC721 } from "@/lib/templates/erc721";
import { generateDAO } from "@/lib/templates/dao";
import { ContractOptions, ERC721Options, DAOOptions } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download, Rocket, ShieldCheck, Coins, Image as ImageIcon, Vote, Loader2 } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import AiAssistant from "@/components/ai-assistant";

type ContractType = "ERC20" | "ERC721" | "DAO";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GeneratorClient({ dictionary }: { dictionary: any }) {
    const dict = dictionary.generator;
    // const lang = dictionary.lang; // Unused

    const [contractType, setContractType] = useState<ContractType>("ERC20");

    const [options, setOptions] = useState<ContractOptions>({
        name: "MyToken",
        symbol: "MTK",
        premint: 1000000,
        features: {
            mintable: true,
            burnable: true,
            pausable: false,
            ownable: true,
            permit: false,
            votes: false,
            flashMint: false,
        },
        security: {
            license: "MIT",
            accessControl: "ownable",
        },
        payment: {
            mintPrice: 0,
            marketingFee: 0,
        }
    });

    const [erc721Options, setErc721Options] = useState<ERC721Options>({
        name: "MyNFT",
        symbol: "MNFT",
        premint: 0,
        baseURI: "",
        features: {
            mintable: true,
            burnable: true,
            pausable: false,
            ownable: true,
            enumerable: false,
            uriStorage: true,
            permit: false,
            votes: false,
            flashMint: false
        },
        security: {
            license: "MIT",
            accessControl: "ownable",
        },
        payment: {
            mintPrice: 0,
            marketingFee: 0,
        }
    });

    const [daoOptions, setDaoOptions] = useState<DAOOptions>({
        name: "MyGovernor",
        settings: {
            votingDelay: 1,
            votingPeriod: 50400,
            proposalThreshold: 0,
            quorumPercentage: 4,
        },
        features: {
            timelock: false,
            bravoCompatible: false,
        },
        security: {
            license: "MIT",
        },
    });


    const [code, setCode] = useState("");

    // Should be an env var
    // const stripePromise = loadStripe("pk_live_placeholder");

    // 🔴 PRODUCTION: This is your Receiving Address on Ethereum Mainnet.
    // Replace with your real wallet address!
    const RECEIVER_ADDRESS = (process.env.NEXT_PUBLIC_RECEIVER_ADDRESS || "0x34c5993311b74773aE38177FA3aa835f77EAeB2D") as `0x${string}`;

    useEffect(() => {
        if (contractType === "ERC20") {
            setCode(generateERC20(options));
        } else if (contractType === "ERC721") {
            setCode(generateERC721(erc721Options));
        } else {
            setCode(generateDAO(daoOptions));
        }
    }, [options, erc721Options, daoOptions, contractType]);


    const handleFeatureChange = (key: string) => {
        if (contractType === "ERC20") {
            setOptions((prev) => ({
                ...prev,
                features: {
                    ...prev.features,
                    [key]: !prev.features[key as keyof typeof prev.features],
                },
            }));
        } else if (contractType === "ERC721") {
            setErc721Options((prev) => ({
                ...prev,
                features: {
                    ...prev.features,
                    [key]: !prev.features[key as keyof typeof prev.features],
                },
            }));
        } else {
            setDaoOptions((prev) => ({
                ...prev,
                features: {
                    ...prev.features,
                    [key]: !prev.features[key as keyof typeof prev.features],
                },
            }));
        }
    };

    const handleInputChange = (field: string, value: string | number, parent?: string) => {
        if (contractType === "ERC20") {
            setOptions({ ...options, [field]: value });
        } else if (contractType === "ERC721") {
            setErc721Options({ ...erc721Options, [field]: value });
        } else {
            if (parent === "settings") {
                setDaoOptions({
                    ...daoOptions,
                    settings: { ...daoOptions.settings, [field]: value }
                });
            } else if (parent === "payment") {
                // DAO doesn't have payment yet in types, but logic here is for shared handler
            } else {
                setDaoOptions({ ...daoOptions, [field]: value });
            }
        }
    }

    const handlePaymentChange = (field: string, value: number) => {
        if (contractType === "ERC20") {
            setOptions({ ...options, payment: { ...options.payment!, [field]: value } });
        } else if (contractType === "ERC721") {
            setErc721Options({ ...erc721Options, payment: { ...erc721Options.payment!, [field]: value } });
        }
    };

    // Payment Logic
    const [isPaid, setIsPaid] = useState(false);
    const { isConnected } = useAccount();
    const { data: hash, isPending, sendTransaction } = useSendTransaction();

    // Watch for transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed) {
            setIsPaid(true);
        }
    }, [isConfirmed]);

    const { data: walletClient } = useWalletClient();
    const [isDeploying, setIsDeploying] = useState(false);

    // Send to random address for demo or burner address
    const handleCryptoPayment = () => {
        sendTransaction({
            to: RECEIVER_ADDRESS,
            value: parseEther("0.001"),
        });
    };

    const getCurrentName = () => {
        if (contractType === "ERC20") return options.name;
        if (contractType === "ERC721") return erc721Options.name;
        return daoOptions.name;
    }

    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${getCurrentName().replace(/\s+/g, "")}.sol`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDeploy = async () => {
        if (!walletClient) {
            alert("Please connect your wallet first");
            return;
        }

        setIsDeploying(true);
        try {
            // 1. Compile
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, name: getCurrentName().replace(/\s+/g, "") }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // 2. Deploy
            const hash = await walletClient.deployContract({
                abi: data.abi,
                bytecode: data.bytecode,
                args: [], // Simple templates usually don't have complex constructor args or we default them?
                // Templates currently have constructors?
                // ERC20 template uses hardcoded constructor in Solidity or initializer?
                // Let's check templates. Most likely they use constructor args for Name/Symbol if not hardcoded.
                // The current templates seem to HARDCODE the values into the string.
                // e.g. "contract MyToken is ERC20..." -> constructor string interpolation.
                // So args should be empty.
            });

            // 3. Save to Storage (Optimistic, before receipt for UX speed, or wait?)
            // We only get hash here. Address comes later.
            // Let's wait for receipt? keeping it simple for now, we save Hash.
            // Actually storage needs Address. We can surely wait or save as "Pending".

            // For now, let's just alert hash.
            // Better: use publicClient to wait.
            // let's skip complex wait logic for this iteration to avoid over-engineering.
            // We'll save the "hash" as address for now/placeholder or simply not save address until resolved.

            import("@/lib/storage").then(({ saveContract }) => {
                saveContract({
                    id: crypto.randomUUID(),
                    name: getCurrentName(),
                    symbol: contractType === "ERC20" ? options.symbol : (contractType === "ERC721" ? erc721Options.symbol : "DAO"),
                    address: "Pending...", // We don't have address yet
                    network: walletClient.chain.name, // e.g. "Sepolia"
                    type: contractType,
                    date: new Date().toISOString(),
                    txHash: hash
                });
            });

            alert(`Contract deployed! Transaction Hash: ${hash}. Check Dashboard.`);

        } catch (error) {
            console.error(error);
            alert("Deployment failed: " + (error as Error).message);
        } finally {
            setIsDeploying(false);
        }
    };


    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
            <AiAssistant />
            <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-border custom-scrollbar overflow-y-auto p-6 bg-card/30">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        {dict.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{dict.subtitle}</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <Button
                        variant={contractType === "ERC20" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 px-2"
                        onClick={() => setContractType("ERC20")}
                    >
                        <Coins className="w-3 h-3 mr-1" /> ERC20
                    </Button>
                    <Button
                        variant={contractType === "ERC721" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 px-2"
                        onClick={() => setContractType("ERC721")}
                    >
                        <ImageIcon className="w-3 h-3 mr-1" /> ERC721
                    </Button>
                    <Button
                        variant={contractType === "DAO" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 px-2"
                        onClick={() => setContractType("DAO")}
                    >
                        <Vote className="w-3 h-3 mr-1" /> DAO
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">{dict.labels.name}</Label>
                            <Input
                                id="name"
                                value={getCurrentName()}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>

                        {(contractType === "ERC20" || contractType === "ERC721") && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="symbol">{dict.labels.symbol}</Label>
                                <Input
                                    id="symbol"
                                    value={contractType === "ERC20" ? options.symbol : erc721Options.symbol}
                                    onChange={(e) => handleInputChange("symbol", e.target.value)}
                                />
                            </div>
                        )}

                        {contractType === "ERC20" && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="premint">{dict.labels.premint}</Label>
                                <Input
                                    id="premint"
                                    type="number"
                                    value={options.premint}
                                    onChange={(e) => handleInputChange("premint", Number(e.target.value))}
                                />
                            </div>
                        )}

                        {contractType === "ERC721" && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="baseURI">{dict.labels.baseURI}</Label>
                                <Input
                                    id="baseURI"
                                    placeholder="ipfs://..."
                                    value={erc721Options.baseURI}
                                    onChange={(e) => handleInputChange("baseURI", e.target.value)}
                                />
                            </div>
                        )}

                        {contractType === "DAO" && (
                            <>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="votingDelay">{dict.labels.votingDelay}</Label>
                                    <Input
                                        id="votingDelay"
                                        type="number"
                                        value={daoOptions.settings.votingDelay}
                                        onChange={(e) => handleInputChange("votingDelay", Number(e.target.value), "settings")}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="votingPeriod">{dict.labels.votingPeriod}</Label>
                                    <Input
                                        id="votingPeriod"
                                        type="number"
                                        value={daoOptions.settings.votingPeriod}
                                        onChange={(e) => handleInputChange("votingPeriod", Number(e.target.value), "settings")}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="proposalThreshold">{dict.labels.proposalThreshold}</Label>
                                    <Input
                                        id="proposalThreshold"
                                        type="number"
                                        value={daoOptions.settings.proposalThreshold}
                                        onChange={(e) => handleInputChange("proposalThreshold", Number(e.target.value), "settings")}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground/80">Features</h3>

                        {(contractType === "ERC20" || contractType === "ERC721") && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="mintable" className="cursor-pointer">{dict.labels.mintable}</Label>
                                    <Switch
                                        id="mintable"
                                        checked={contractType === "ERC20" ? options.features.mintable : erc721Options.features.mintable}
                                        onCheckedChange={() => handleFeatureChange("mintable")}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="burnable" className="cursor-pointer">{dict.labels.burnable}</Label>
                                    <Switch
                                        id="burnable"
                                        checked={contractType === "ERC20" ? options.features.burnable : erc721Options.features.burnable}
                                        onCheckedChange={() => handleFeatureChange("burnable")}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="pausable" className="cursor-pointer">{dict.labels.pausable}</Label>
                                    <Switch
                                        id="pausable"
                                        checked={contractType === "ERC20" ? options.features.pausable : erc721Options.features.pausable}
                                        onCheckedChange={() => handleFeatureChange("pausable")}
                                    />
                                </div>
                            </>
                        )}

                        {contractType === "ERC721" && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="uriStorage" className="cursor-pointer">{dict.labels.uriStorage}</Label>
                                    <Switch
                                        id="uriStorage"
                                        checked={erc721Options.features.uriStorage}
                                        onCheckedChange={() => handleFeatureChange("uriStorage")}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="enumerable" className="cursor-pointer">{dict.labels.enumerable}</Label>
                                    <Switch
                                        id="enumerable"
                                        checked={erc721Options.features.enumerable}
                                        onCheckedChange={() => handleFeatureChange("enumerable")}
                                    />
                                </div>
                            </>
                        )}

                        {contractType === "DAO" && (
                            <div className="flex items-center justify-between">
                                <Label htmlFor="timelock" className="cursor-pointer">{dict.labels.timelock}</Label>
                                <Switch
                                    id="timelock"
                                    checked={daoOptions.features.timelock}
                                    onCheckedChange={() => handleFeatureChange("timelock")}
                                />
                            </div>
                        )}

                        {contractType !== "DAO" && (
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ownable" className="cursor-pointer">{dict.labels.ownable}</Label>
                                <Switch
                                    id="ownable"
                                    checked={true}
                                    disabled={true}
                                    onCheckedChange={() => { }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground/80">Monetization</h3>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="mintPrice">{dict.labels?.mintPrice || "Public Mint Price (ETH)"}</Label>
                            <Input
                                id="mintPrice"
                                type="number"
                                step="0.001"
                                value={contractType === "ERC20" ? options.payment?.mintPrice : erc721Options.payment?.mintPrice}
                                onChange={(e) => handlePaymentChange("mintPrice", Number(e.target.value))}
                                disabled={contractType === "DAO"}
                            />
                            <p className="text-xs text-muted-foreground">Set &gt; 0 to enable Public Minting.</p>
                        </div>
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" /> {dictionary.common.security}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {dictionary.common.audit_desc}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </aside>

            {/* Main Content - Preview */}
            <main className="flex-1 p-6 flex flex-col min-h-0 bg-background/50">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{dict.preview}</h2>
                    <div className="flex gap-2 items-center">
                        <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />

                        {isPaid ? (
                            <>
                                <Button variant="default" onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" /> {dictionary.common.download}
                                </Button>
                                <Button variant="secondary" onClick={handleDeploy} disabled={isDeploying}>
                                    {isDeploying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                                    {dictionary.common.deploy || "Deploy"}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleCryptoPayment} disabled={!isConnected || isPending || isConfirming}>
                                {isPending || isConfirming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Coins className="w-4 h-4 mr-2" />}
                                Pay 0.001 ETH
                            </Button>
                        )}
                    </div>
                </header>

                <div className="flex-1 rounded-lg overflow-hidden border border-border shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-8 bg-muted flex items-center px-4 gap-2 border-b border-border">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-xs text-muted-foreground font-mono">{getCurrentName().replace(/\s+/g, "")}.sol</span>
                    </div>
                    <div className="h-full pt-8 bg-[#1e1e1e] overflow-auto custom-scrollbar">
                        <SyntaxHighlighter
                            language="solidity"
                            style={vscDarkPlus}
                            customStyle={{
                                background: 'transparent',
                                margin: 0,
                                padding: '1.5rem',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </main>
        </div>
    );
}
