"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Upload, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function IPFSAssistant() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }]);

    const addAttribute = () => {
        setAttributes([...attributes, { trait_type: "", value: "" }]);
    };

    const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    // Generate JSON
    const metadata = {
        name,
        description,
        image,
        attributes: attributes.filter(a => a.trait_type && a.value)
    };

    const jsonString = JSON.stringify(metadata, null, 2);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                    IPFS Metadata Assistant
                </h1>
                <p className="text-muted-foreground">
                    Generate the JSON metadata required for your NFT Collection.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FORM */}
                <Card>
                    <CardHeader>
                        <CardTitle>NFT Details</CardTitle>
                        <CardDescription>Enter individual token details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input placeholder="Cool Monkey #1" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="A very cool monkey living on chain." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL (IPFS or HTTPS)</Label>
                            <div className="flex gap-2">
                                <Input placeholder="ipfs://Qm..." value={image} onChange={(e) => setImage(e.target.value)} />
                                <Button variant="outline" size="icon" title="You need to upload image to IPFS first (e.g. Pinata)">
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Tip: Upload your image to Pinata.cloud first, then paste the URL here.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Attributes (Traits)</Label>
                            {attributes.map((attr, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input
                                        placeholder="Type (e.g. Color)"
                                        value={attr.trait_type}
                                        onChange={(e) => updateAttribute(i, "trait_type", e.target.value)}
                                    />
                                    <Input
                                        placeholder="Value (e.g. Blue)"
                                        value={attr.value}
                                        onChange={(e) => updateAttribute(i, "value", e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button variant="secondary" size="sm" onClick={addAttribute} className="w-full">
                                + Add Attribute
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* PREVIEW & JSON */}
                <div className="space-y-6">
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Metadata Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-2"
                                    onClick={() => navigator.clipboard.writeText(jsonString)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <pre className="p-4 bg-background border rounded-lg overflow-x-auto text-xs font-mono">
                                    {jsonString}
                                </pre>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                            <div className="text-sm text-muted-foreground">
                                <p className="font-bold mb-1">How to use:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Copy this JSON code.</li>
                                    <li>Save it as a file (e.g. <code>1.json</code>).</li>
                                    <li>Upload this JSON file to IPFS (Pinata).</li>
                                    <li>Use the resulting IPFS folder URL as your <code>BaseURI</code> in SmartGen.</li>
                                </ol>
                            </div>
                            <Button className="w-full" asChild>
                                <a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer">
                                    <Upload className="w-4 h-4 mr-2" /> Go to Pinata (Storage)
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
