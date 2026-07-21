import { test as base, expect } from '@playwright/test';
import { CalculatorPage } from '../../src/pages/CalculatorPage';

type CalculatorFixtures = {
  calculatorPage: CalculatorPage;
};

export const test = base.extend<CalculatorFixtures>({
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
    await calculatorPage.prepareMobileView();
    await use(calculatorPage);
  },
});

export { expect };
