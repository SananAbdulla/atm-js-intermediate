import { test, expect } from '@playwright/test';
import { appleAdvancedRegion, appleProductCases } from '../data/apple-regions';
import {
  bagNavLink,
  normalizeText,
  openAppleProductPage,
  openAppleRegionalHome,
  productPrice,
  setAppleGeoCookie,
  storeNavLink,
} from './apple.helpers';

test.describe('Apple advanced localization scenarios', () => {
  test('Ukraine shows localized availability notice without store or bag', async ({
    page,
    context,
  }) => {
    await setAppleGeoCookie(context, appleAdvancedRegion.geo);
    await openAppleRegionalHome(page, appleAdvancedRegion.path);

    const bodyText = normalizeText(await page.locator('body').innerText());
    expect(bodyText).toMatch(appleAdvancedRegion.availabilityNotice!);

    await expect(storeNavLink(page)).toHaveCount(0);
    await expect(bagNavLink(page)).toHaveCount(0);
  });

  test('UK and Singapore expose different regional currencies for the same product', async ({
    browser,
  }) => {
    const uk = appleProductCases.find((region) => region.geo === 'GB')!;
    const sg = appleProductCases.find((region) => region.geo === 'SG')!;

    const ukContext = await browser.newContext();
    await setAppleGeoCookie(ukContext, uk.geo);
    const ukPage = await ukContext.newPage();
    await openAppleProductPage(ukPage, uk.productPath);
    const ukPrice = normalizeText(await productPrice(ukPage).innerText());
    await ukContext.close();

    const sgContext = await browser.newContext();
    await setAppleGeoCookie(sgContext, sg.geo);
    const sgPage = await sgContext.newPage();
    await openAppleProductPage(sgPage, sg.productPath);
    const sgPrice = normalizeText(await productPrice(sgPage).innerText());
    await sgContext.close();

    expect(ukPrice).toMatch(uk.currencyPattern);
    expect(sgPrice).toMatch(sg.currencyPattern);
    expect(ukPrice).not.toEqual(sgPrice);
  });
});
