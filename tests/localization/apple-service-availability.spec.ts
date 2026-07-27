import { test, expect } from '@playwright/test';
import { appleAvailabilityRegions } from '../data/apple-regions';
import {
  bagNavLink,
  normalizeText,
  openAppleRegionalHome,
  setAppleGeoCookie,
  storeNavLink,
} from './apple.helpers';

const shopRegions = appleAvailabilityRegions.filter((region) => region.shopAvailable);
const restrictedRegions = appleAvailabilityRegions.filter((region) => !region.shopAvailable);

test.describe('Apple service availability by region', () => {
  for (const region of shopRegions) {
    test(`${region.name}: shows store and bag without unavailability notice`, async ({
      page,
      context,
    }) => {
      await setAppleGeoCookie(context, region.geo);
      await openAppleRegionalHome(page, region.path);

      await expect(storeNavLink(page).first()).toBeVisible();
      await expect(bagNavLink(page).first()).toBeVisible();

      const bodyText = normalizeText(await page.locator('body').innerText());
      expect(bodyText).not.toMatch(
        /Products,\s*services,\s*and OS functions may not be available in this country/i,
      );
    });
  }

  for (const region of restrictedRegions) {
    test(`${region.name}: shows availability notice and hides store and bag`, async ({
      page,
      context,
    }) => {
      await setAppleGeoCookie(context, region.geo);
      await openAppleRegionalHome(page, region.path);

      await expect(storeNavLink(page)).toHaveCount(0);
      await expect(bagNavLink(page)).toHaveCount(0);

      const bodyText = normalizeText(await page.locator('body').innerText());
      expect(bodyText).toMatch(region.availabilityNotice!);
    });
  }
});
