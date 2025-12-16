"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Image as ImageIcon, Vote, Check, ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TemplatesView({ dictionary, lang }: { dictionary: any, lang: string }) {
    const dict = dictionary.common;
    const landing = dictionary.landing;

    const templates = [
        {
            id: "erc20",
            title: "ERC20 Token",
            description: "Standard fungible token for utility, governance, or currency.",
            icon: Coins,
            features: ["Mintable", "Burnable", "Pausable", "Supply Cap"],
            popular: true
        },
        {
            id: "erc721",
            title: "ERC721 NFT",
            description: "Non-fungible token standard for digital assets and collectibles.",
            icon: ImageIcon,
            features: ["URI Storage", "Enumerable", "Royalty Support"],
            popular: false
        },
        {
            id: "dao",
            title: "Governor DAO",
            description: "On-chain governance for decentralized organizations.",
            icon: Vote,
            features: ["Timelock", "Voting Delay", "Proposal Threshold"],
            popular: false
        }
    ];

    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl">
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{dict.templates}</h1>
                <p className="text-xl text-muted-foreground">{landing.feat_custom_desc}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <Card key={template.id} className="flex flex-col border-border/50 hover:border-primary/50 transition-colors bg-card/50">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                                    <template.icon className="w-8 h-8" />
                                </div>
                                {template.popular && (
                                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Popular</Badge>
                                )}
                            </div>
                            <CardTitle className="text-2xl">{template.title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {template.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 mb-6">
                                {template.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 mr-2 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/${lang}/generator`} className="w-full">
                                <Button className="w-full group">
                                    Use Template <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
