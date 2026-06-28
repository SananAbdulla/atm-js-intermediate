import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Cloud Calculator extended', () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
  });

  test('should display the pricing calculator heading', async ({ calculatorPage }) => {
    await expect(calculatorPage.pageHeading()).toBeVisible();
  });

  test('should open the add estimate dialog', async ({ calculatorPage }) => {
    await calculatorPage.addEstimateButton().click();

    await expect(calculatorPage.addEstimationModalWindow()).toBeVisible();
    await expect(calculatorPage.computeEngineOption()).toBeVisible();
  });

  test('should update monthly cost when instances are incremented', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
    const initialCost = await calculatorPage.monthlyCost().textContent();

    await calculatorPage.addInstances(1);

    await expect(calculatorPage.monthlyCost()).not.toHaveText(initialCost ?? '');
    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
  });
});
