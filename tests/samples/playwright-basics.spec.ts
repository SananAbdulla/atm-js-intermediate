import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../src/pages/CalculatorPage';

test.describe('Playwright basics', () => {
  test('should navigate to the calculator page', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();

    await expect(page).toHaveURL(/\/products\/calculator$/);
  });

  test('should interact with visible page elements', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();

    await expect(calculatorPage.addEstimateButton()).toBeVisible();
  });
});
