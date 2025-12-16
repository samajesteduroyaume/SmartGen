import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { address, sourceCode, contractname, compilerversion, network } = await req.json();

        if (!address || !sourceCode || !contractname) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Determine API URL based on network
        let apiUrl = "https://api.etherscan.io/api";
        let apiKey = process.env.ETHERSCAN_API_KEY;

        if (network === "Sepolia" || network.toLowerCase() === "sepolia") {
            apiUrl = "https://api-sepolia.etherscan.io/api";
        } else if (network === "Polygon" || network.toLowerCase() === "polygon") {
            apiUrl = "https://api.polygonscan.com/api";
            apiKey = process.env.POLYGONSCAN_API_KEY || apiKey; // Fallback or separate key
        }

        if (!apiKey) {
            return NextResponse.json({ error: "Server missing API Key configuration" }, { status: 500 });
        }

        const params = new URLSearchParams();
        params.append("apikey", apiKey);
        params.append("module", "contract");
        params.append("action", "verifysourcecode");
        params.append("contractaddress", address);
        params.append("sourceCode", sourceCode);
        params.append("codeformat", "solidity-single-file");
        params.append("contractname", contractname);
        params.append("compilerversion", compilerversion || "v0.8.20+commit.a1b79de6"); // Default to recent stable
        params.append("optimizationUsed", "0"); // Default no opt

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const data = await response.json();

        if (data.status === "0") {
            return NextResponse.json({ error: data.result }, { status: 400 });
        }

        return NextResponse.json({ result: data.result, message: "Verification submitted successfully" });

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
