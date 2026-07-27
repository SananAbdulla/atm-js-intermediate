export type AppleRegion = {
  name: string;
  geo: string;
  path: string;
  shopAvailable: boolean;
  availabilityNotice?: RegExp;
  footerLocale?: string;
};

export type AppleProductCase = {
  name: string;
  geo: string;
  path: string;
  productPath: string;
  currencyPattern: RegExp;
  titlePattern: RegExp;
  buyCtaPattern: RegExp;
};

/** Regions used for service-availability coverage (shop vs restricted). */
export const appleAvailabilityRegions: AppleRegion[] = [
  {
    name: 'United Kingdom',
    geo: 'GB',
    path: '/uk/',
    shopAvailable: true,
    footerLocale: 'United Kingdom',
  },
  {
    name: 'Singapore',
    geo: 'SG',
    path: '/sg/',
    shopAvailable: true,
    footerLocale: 'Singapore',
  },
  {
    name: 'Georgia',
    geo: 'GE',
    path: '/ge/',
    shopAvailable: false,
    availabilityNotice:
      /Products,\s*services,\s*and OS functions may not be available in this country/i,
    footerLocale: 'Georgia',
  },
  {
    name: 'Belarus',
    geo: 'BY',
    path: '/by/',
    shopAvailable: false,
    availabilityNotice:
      /Products,\s*services,\s*and OS functions may not be available in this country/i,
  },
];

/** Shop regions used for product-card currency and CTA localization. */
export const appleProductCases: AppleProductCase[] = [
  {
    name: 'United Kingdom',
    geo: 'GB',
    path: '/uk/',
    productPath: '/uk/shop/buy-iphone/iphone-16',
    currencyPattern: /£\s?[\d,]+/,
    titlePattern: /Buy iPhone 16/i,
    buyCtaPattern: /Continue/i,
  },
  {
    name: 'Singapore',
    geo: 'SG',
    path: '/sg/',
    productPath: '/sg/shop/buy-iphone/iphone-16',
    currencyPattern: /S\$\s?[\d,]+/,
    titlePattern: /Buy iPhone 16/i,
    buyCtaPattern: /Continue/i,
  },
  {
    name: 'Germany',
    geo: 'DE',
    path: '/de/',
    productPath: '/de/shop/buy-iphone/iphone-16',
    currencyPattern: /€\s?[\d.,]+|[\d.,]+\s?€/,
    titlePattern: /iPhone 16/,
    buyCtaPattern: /Weiter/i,
  },
];

/** Advanced localization case: restricted region with non-English notice. */
export const appleAdvancedRegion: AppleRegion = {
  name: 'Ukraine',
  geo: 'UA',
  path: '/ua/',
  shopAvailable: false,
  availabilityNotice:
    /Продукти,\s*послуги та функції операційних систем можуть бути недоступними в цій країні/i,
  footerLocale: 'Ukraine',
};
