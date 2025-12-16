"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoginView({ dictionary }: { dictionary: any }) {
    const dict = dictionary.common;

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{dict.login}</CardTitle>
                    <CardDescription>
                        {dict.connect_wallet_desc || "Connect your wallet to access the dashboard and generate contracts."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                    <ConnectButton label={dict.connect || "Connect Wallet"} />
                </CardContent>
            </Card>
        </div>
    );
}
