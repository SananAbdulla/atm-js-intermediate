import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Positive scenarios', () => {
  test('should close the add estimate dialog without adding a product', async ({
    calculatorPage,
  }) => {
    await calculatorPage.openAddEstimateDialog();
    await calculatorPage.closeAddEstimateDialog();

    await expect(calculatorPage.addEstimationDialogHeading()).toBeHidden();
    await expect(calculatorPage.configurationBlock()).toBeHidden();
  });

  test('should display Compute Engine configuration for a valid product selection', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.configurationBlock()).toBeVisible();
    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
  });
});
