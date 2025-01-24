// locale settings for this theme
// https://astro-i18n-starter.pages.dev/setup/

export const DEFAULT_LOCALE_SETTING: string = "en";

export const LOCALES_SETTING: LocaleSetting = {
  "en": {
    "label": "English",
    "flag": "🇺🇸"
  },
  "es": {
    "label": "Español",
    "flag": "🇨🇴"
  },
  "pt-br": {
    "label": "Portuges",
    "flag": "🇧🇷"
  },
};

interface LocaleSetting {
  [key: Lowercase<string>]: {
    label: string;
    lang?: string;
    dir?: 'rtl' | 'ltr';
    flag?: string;
  };
} // refer: https://starlight.astro.build/reference/configuration/#locales
