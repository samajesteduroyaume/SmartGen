import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, ShieldCheck, Zap, Check } from "lucide-react";
import { getDictionary, Locale } from "@/lib/get-dictionary";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            SmartGen
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href={`/${lang}/dashboard`} className="hover:text-foreground transition-colors">{dict.common.dashboard}</Link>
          <Link href={`/${lang}/tutorial`} className="hover:text-foreground transition-colors">{dict.common.tutorial}</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">{dict.common.pricing}</Link>
          <Link href={`/${lang}/templates`} className="hover:text-foreground transition-colors">{dict.common.templates}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/login`}>
            <Button variant="ghost" size="sm">{dict.common.login}</Button>
          </Link>
          <Link href={`/${lang}/generator`}>
            <Button size="sm">{dict.common.getStarted}</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -top-32 -z-10" />

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
            {dict.landing.hero_title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            {dict.landing.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${lang}/generator`}>
              <Button size="lg" className="h-12 px-8 text-lg gap-2">
                {dict.landing.cta_new} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${lang}/templates`}>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                {dict.landing.cta_view}
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid Verification */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{dict.landing.feat_instant_title}</h3>
            <p className="text-muted-foreground">{dict.landing.feat_instant_desc}</p>
          </div>
          <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <ShieldCheck className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{dict.landing.feat_audit_title}</h3>
            <p className="text-muted-foreground">{dict.landing.feat_audit_desc}</p>
          </div>
          <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
            <Code2 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{dict.landing.feat_custom_title}</h3>
            <p className="text-muted-foreground">{dict.landing.feat_custom_desc}</p>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 relative bg-card/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{dict.common.pricing}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple, transparent pricing. Pay only for what you deploy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Testnet</h3>
                <div className="text-4xl font-bold mb-6">Free</div>
                <p className="text-muted-foreground text-sm mb-6">Perfect for learning and testing your contracts.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Testnet Deployment</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Standard Templates</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Basic Support</li>
                </ul>
                <Link href={`/${lang}/generator`}>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 shadow-xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-blue-500" />
                <h3 className="font-semibold text-lg mb-2 text-primary">Mainnet</h3>
                <div className="text-4xl font-bold mb-1">0.001 ETH</div>
                <div className="text-xs text-muted-foreground mb-6">per deployment</div>
                <p className="text-muted-foreground text-sm mb-6">For production-ready contracts.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Mainnet Deployment</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Verified Code</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Priority Support</li>
                </ul>
                <Link href={`/${lang}/generator`}>
                  <Button className="w-full">Deploy Now</Button>
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col">
                <h3 className="font-semibold text-lg mb-2">Custom</h3>
                <div className="text-4xl font-bold mb-6">Contact</div>
                <p className="text-muted-foreground text-sm mb-6">For complex requirements and audits.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Custom Development</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> Full Audit Report</li>
                  <li className="flex items-center text-sm"><Check className="w-4 h-4 mr-2 text-primary" /> SLA Support</li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
