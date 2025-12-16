import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.MISTRAL_API_KEY;

        if (!apiKey) {
            // Mock Response if no key
            return NextResponse.json({
                role: "assistant",
                content: "I am SmartGen AI. To use my full brain, please add MISTRAL_API_KEY to your .env file. For now, I can tell you that your project looks great! Try selecting ERC20 for a standard token."
            });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: [
                    { role: "system", content: "You are SmartGen AI, an expert Solidity developer. Help the user configure their smart contract. Keep answers concise." },
                    ...messages
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return NextResponse.json(data.choices[0].message);

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "AI Service Unavailable" }, { status: 500 });
    }
}
