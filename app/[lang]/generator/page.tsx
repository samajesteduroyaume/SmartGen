import { getDictionary, Locale } from "@/lib/get-dictionary";
import GeneratorClient from "@/components/generator-client";

export default async function GeneratorPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);
    return <GeneratorClient dictionary={dictionary} />;
}
