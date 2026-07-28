import { test as base, expect } from '@playwright/test';
import { DesmosPage } from '../../src/pages/DesmosPage';

type DesmosFixtures = {
  desmosPage: DesmosPage;
};

export const test = base.extend<DesmosFixtures>({
  desmosPage: async ({ page }, use) => {
    const desmosPage = new DesmosPage(page);
    await desmosPage.open();
    await use(desmosPage);
  },
});

export { expect };
