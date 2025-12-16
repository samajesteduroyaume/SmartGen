import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Contract Generator",
  description: "Generate secure, audit-ready Smart Contracts in seconds.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} className="dark">
      <body className={cn(font.className, "bg-background text-foreground min-h-screen antialiased selection:bg-primary/20 match-braces-rainbow-tags")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
