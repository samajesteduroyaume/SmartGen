import { getDictionary, Locale } from "@/lib/get-dictionary";
import { ArrowRight, CheckCircle2, FileCode2, Settings2, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TutorialPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">{dict.tutorial.title}</h1>
                <p className="text-xl text-muted-foreground">{dict.landing.hero_subtitle}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-16 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary to-primary/20 -z-10 opacity-50" />

                {/* Step 1 */}
                <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center text-center relative shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary border-2 border-primary">
                        <FileCode2 className="w-8 h-8" />
                    </div>
                    <div className="absolute top-6 right-6 text-6xl font-black text-foreground/5 -z-10">1</div>
                    <h3 className="text-xl font-bold mb-2">{dict.tutorial.step1_title}</h3>
                    <p className="text-muted-foreground">{dict.tutorial.step1_desc}</p>
                </div>

                {/* Step 2 */}
                <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center text-center relative shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary border-2 border-primary">
                        <Settings2 className="w-8 h-8" />
                    </div>
                    <div className="absolute top-6 right-6 text-6xl font-black text-foreground/5 -z-10">2</div>
                    <h3 className="text-xl font-bold mb-2">{dict.tutorial.step2_title}</h3>
                    <p className="text-muted-foreground">{dict.tutorial.step2_desc}</p>
                </div>

                {/* Step 3 */}
                <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center text-center relative shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary border-2 border-primary">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="absolute top-6 right-6 text-6xl font-black text-foreground/5 -z-10">3</div>
                    <h3 className="text-xl font-bold mb-2">{dict.tutorial.step3_title}</h3>
                    <p className="text-muted-foreground">{dict.tutorial.step3_desc}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-primary" />
                        {dict.landing.cta_new}
                    </h2>
                    <p className="text-zinc-400">{dict.landing.feat_instant_desc}</p>
                </div>
                <Link href={`/${lang}/generator`}>
                    <Button size="lg" className="px-8 text-lg font-semibold shadow-xl shadow-primary/20">
                        {dict.common.getStarted} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
