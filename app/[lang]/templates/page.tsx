import { getDictionary, Locale } from "@/lib/get-dictionary";
import TemplatesView from "@/components/templates-view";

export default async function TemplatesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);
    return <TemplatesView dictionary={dictionary} lang={lang} />;
}
