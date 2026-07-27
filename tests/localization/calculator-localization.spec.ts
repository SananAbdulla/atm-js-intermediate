import { test, expect } from '../fixtures/calculator.fixture';
import { localizationCases } from '../data/localization';

for (const locale of localizationCases) {
  test(`header and footer reflect ${locale.language} localization`, async ({ calculatorPage }) => {
    await calculatorPage.selectLanguage(locale.localeCode);

    await expect(calculatorPage.header()).toContainText(locale.headerExpected);
    await expect(calculatorPage.footer()).toContainText(locale.footerExpected);
  });
}
