import { getDictionary, Locale } from "@/lib/get-dictionary";
import LoginView from "@/components/login-view";

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);
    return <LoginView dictionary={dictionary} />;
}
