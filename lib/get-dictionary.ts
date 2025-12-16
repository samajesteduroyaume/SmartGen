import "server-only";

const dictionaries = {
    en: () => import("@/dictionaries/en.json").then((module) => module.default),
    fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
    es: () => import("@/dictionaries/es.json").then((module) => module.default),
    de: () => import("@/dictionaries/de.json").then((module) => module.default),
};

export const getDictionary = async (locale: keyof typeof dictionaries) =>
    dictionaries[locale]();

export const i18n = {
    defaultLocale: "en",
    locales: ["en", "fr", "es", "de"],
} as const;

export type Locale = keyof typeof dictionaries;
