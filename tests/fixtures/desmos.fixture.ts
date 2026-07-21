import { test as base, expect } from '@playwright/test';
import { DesmosCalculatorPage } from '../../src/pages/DesmosCalculatorPage';

const desmosBaseURL = process.env.DESMOS_BASE_URL ?? 'https://www.desmos.com';

type DesmosFixtures = {
  desmosPage: DesmosCalculatorPage;
};

export const test = base.extend<DesmosFixtures>({
  desmosPage: async ({ page }, use) => {
    const desmosPage = new DesmosCalculatorPage(page);
    await desmosPage.openCalculator(desmosBaseURL);
    await desmosPage.dismissPromoMessage();
    await desmosPage.expressionList().waitFor({ state: 'visible' });
    await use(desmosPage);
  },
});

export { expect };
