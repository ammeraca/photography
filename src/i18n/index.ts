import { fr } from "./fr";
import { en } from "./en";
import type { Translations } from "./fr";

export type Locale = "fr" | "en";

const translations: Record<Locale, Translations> = { fr, en };

export function getT(locale: Locale): Translations {
	return translations[locale];
}
