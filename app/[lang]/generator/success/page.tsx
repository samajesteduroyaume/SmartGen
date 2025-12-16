import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
// import { getDictionary, Locale } from "@/lib/get-dictionary";

export default async function SuccessPage({ params, searchParams }: { params: Promise<{ lang: string }>, searchParams: Promise<{ session_id: string }> }) {
    const { lang } = await params;
    const { session_id } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                    Thank you for your purchase. Your session ID is: <br />
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">{session_id}</code>
                </p>

                <div className="space-y-3 w-full">
                    <Button className="w-full gap-2" size="lg">
                        <Download className="w-4 h-4" /> Download Contract
                    </Button>
                    <Link href={`/${lang}/generator`} className="block w-full">
                        <Button variant="outline" className="w-full gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Generator
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
