import type { BrowserContext, Page } from '@playwright/test';

export function normalizeText(value: string): string {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function setAppleGeoCookie(context: BrowserContext, geo: string): Promise<void> {
  await context.addCookies([
    {
      name: 'geo',
      value: geo,
      domain: '.apple.com',
      path: '/',
    },
  ]);
}

export async function openAppleRegionalHome(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await dismissAppleOverlays(page);
}

export async function openAppleProductPage(page: Page, productPath: string): Promise<void> {
  await page.goto(productPath, { waitUntil: 'domcontentloaded' });
  await dismissAppleOverlays(page);
}

export async function dismissAppleOverlays(page: Page): Promise<void> {
  const consent = page.getByRole('button', {
    name: /allow all|accept all|agree|принять|akzeptieren|accepter/i,
  });
  if (
    await consent
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false)
  ) {
    await consent
      .first()
      .click()
      .catch(() => undefined);
  }

  const regionChooser = page.getByText(/choose another country or region/i);
  if (
    await regionChooser
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false)
  ) {
    const continueRegion = page.getByRole('button', { name: /^continue$/i });
    if (
      await continueRegion
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      await continueRegion
        .first()
        .click()
        .catch(() => undefined);
    }
  }
}

/** Global nav Store link for regions with Apple online shop. */
export function storeNavLink(page: Page) {
  return page.locator(
    [
      'a[data-autom="gn_store"]',
      'a[aria-label="Store"]',
      'a[data-analytics-title="store"]',
      '#globalnav a[href*="/shop/goto/store"]',
      '#ac-globalnav a[href*="/shop/goto/store"]',
    ].join(', '),
  );
}

/** Global nav bag / cart control. */
export function bagNavLink(page: Page) {
  return page.locator(
    [
      'a[data-autom="gn_bag"]',
      '#globalnav-menubutton-link-bag',
      'a.globalnav-link-bag',
      'a[aria-label="Shopping Bag"]',
      '#ac-gn-bag a',
      'a[href*="/shop/goto/bag"]',
    ].join(', '),
  );
}

export function productTitle(page: Page) {
  return page.locator('h1').first();
}

export function productPrice(page: Page) {
  return page
    .locator('[data-autom="full-price"], [data-autom="headerPrice"], [data-autom="stickyPrice"]')
    .first();
}

export function purchaseCta(page: Page, pattern: RegExp) {
  return page.getByRole('button', { name: pattern }).or(page.getByRole('link', { name: pattern }));
}
