import { NextRequest, NextResponse } from "next/server";
import solc from "solc";
import fs from "fs";
import path from "path";

// Helper to find OpenZeppelin contracts in node_modules
function findImports(importPath: string) {
    if (importPath.startsWith("@openzeppelin")) {
        const nodeModulesPath = path.resolve(process.cwd(), "node_modules", importPath);
        try {
            const content = fs.readFileSync(nodeModulesPath, "utf8");
            return { contents: content };
        } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
            return { error: "File not found" };
        }
    }
    return { error: "File not found" };
}

export async function POST(req: NextRequest) {
    try {
        const { code, name } = await req.json();

        const input = {
            language: "Solidity",
            sources: {
                [`${name}.sol`]: {
                    content: code,
                },
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["abi", "evm.bytecode"],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

        if (output.errors) {
            // Filter out warnings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors = output.errors.filter((e: any) => e.severity === "error");
            if (errors.length > 0) {
                return NextResponse.json({ error: errors[0].message }, { status: 400 });
            }
        }

        const contractFile = output.contracts[`${name}.sol`];
        const contract = contractFile[name];

        return NextResponse.json({
            abi: contract.abi,
            bytecode: contract.evm.bytecode.object,
        });
    } catch (error) {
        console.error("Compilation failed:", error);
        return NextResponse.json({ error: "Compilation failed" }, { status: 500 });
    }
}
