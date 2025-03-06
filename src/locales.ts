export const DEFAULT_LOCALE_SETTING: string = 'en';

export const LOCALES_SETTING: LocaleSetting = {
	en: {
		label: 'English',
		flag: '🇺🇸',
	},
	es: {
		label: 'Español',
		flag: '🇨🇴',
	},
	'pt-br': {
		label: 'Portuges',
		flag: '🇧🇷',
	},
};

/**
 * https://starlight.astro.build/reference/configuration/#locales
 */

interface LocaleSetting {
	[key: Lowercase<string>]: {
		label: string;
		lang?: string;
		dir?: 'rtl' | 'ltr';
		flag?: string;
	};
}
