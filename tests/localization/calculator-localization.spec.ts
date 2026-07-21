import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../src/pages/CalculatorPage';
import { localizationCases } from '../data/localization';

for (const locale of localizationCases) {
  test(`header and footer reflect ${locale.language} localization`, async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
    await calculatorPage.selectLanguage(locale.localeCode);

    await expect(calculatorPage.header()).toContainText(locale.headerExpected);
    await expect(calculatorPage.footer()).toContainText(locale.footerExpected);
  });
}
