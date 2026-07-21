import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Mobile navigation', () => {
  test('should open the mobile menu on iPhone 15 Pro', async ({ calculatorPage }) => {
    await expect(calculatorPage.mobileMenuButton()).toBeVisible();

    await calculatorPage.openMobileMenu();

    await expect(calculatorPage.mobileNavigationPanel()).toBeVisible();
  });
});
