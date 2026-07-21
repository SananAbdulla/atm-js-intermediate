export type LocalizationCase = {
  language: string;
  localeCode: string;
  headerExpected: string;
  footerExpected: string;
};

export const localizationCases: LocalizationCase[] = [
  {
    language: 'English',
    localeCode: 'en',
    headerExpected: 'Pricing',
    footerExpected: 'About Google',
  },
  {
    language: 'Español',
    localeCode: 'es',
    headerExpected: 'Precios',
    footerExpected: 'Acerca de Google',
  },
  {
    language: '日本語',
    localeCode: 'ja',
    headerExpected: '料金',
    footerExpected: 'Google について',
  },
];
