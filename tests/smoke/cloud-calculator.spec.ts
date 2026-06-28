import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Cloud Calculator smoke', () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
  });

  test('should be able to add new entities into the calculator', async ({ page, calculatorPage }) => {
    await expect(page).toHaveURL(/\/products\/calculator$/);
    await expect(calculatorPage.addEstimateButton()).toBeVisible();

    await calculatorPage.addComputeEngineEstimate();
    await expect(calculatorPage.configurationBlock()).toBeVisible();
  });

  test('should be able to add two new instances', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.addInstances(2);

    await expect(calculatorPage.monthlyCost()).toHaveText('$201.03');
  });
});
