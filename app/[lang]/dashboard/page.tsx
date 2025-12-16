import { getDictionary, Locale } from "@/lib/get-dictionary";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return <DashboardClient dictionary={dictionary} lang={lang} />;
}
