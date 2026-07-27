import { test, expect } from '@playwright/test';
import { appleProductCases } from '../data/apple-regions';
import {
  normalizeText,
  openAppleProductPage,
  productPrice,
  productTitle,
  purchaseCta,
  setAppleGeoCookie,
} from './apple.helpers';

test.describe('Apple product card localization', () => {
  for (const region of appleProductCases) {
    test(`${region.name}: product title, currency and purchase CTA`, async ({ page, context }) => {
      await setAppleGeoCookie(context, region.geo);
      await openAppleProductPage(page, region.productPath);

      await expect(productTitle(page)).toBeVisible();
      const title = normalizeText(await productTitle(page).innerText());
      expect(title).toMatch(region.titlePattern);

      await expect(productPrice(page)).toBeVisible();
      const price = normalizeText(await productPrice(page).innerText());
      expect(price).toMatch(region.currencyPattern);

      await expect(purchaseCta(page, region.buyCtaPattern).first()).toBeVisible();
    });
  }
});
