import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Cloud Calculator', () => {
  test('should display the pricing calculator page', async ({ page, calculatorPage }) => {
    await expect(page).toHaveURL(/\/products\/calculator$/);
    await expect(calculatorPage.pageHeading()).toBeVisible();
    await expect(calculatorPage.addEstimateButton()).toBeVisible();
  });

  test('should open the add estimate dialog with Compute Engine option', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addEstimateButton().click();

    await expect(calculatorPage.addEstimationModalWindow()).toBeVisible();
    await expect(calculatorPage.computeEngineOption()).toBeVisible();
  });

  test('should close the add estimate dialog when pressing Escape', async ({ calculatorPage }) => {
    await calculatorPage.addEstimateButton().click();
    await expect(calculatorPage.addEstimationModalWindow()).toBeVisible();

    await calculatorPage.page.keyboard.press('Escape');

    await expect(calculatorPage.addEstimationModalWindow()).toBeHidden();
  });

  test('should add a Compute Engine estimate to the calculator', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.configurationBlock()).toBeVisible();
    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
  });

  test('should increase monthly cost when instances are added', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
    const initialCost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.addInstances(2);

    await expect.poll(async () => calculatorPage.getMonthlyCostText()).not.toBe(initialCost);
    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
  });

  test('should decrease monthly cost when instances are removed', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.addInstances(2);

    const increasedCost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.removeInstances(1);

    await expect(calculatorPage.monthlyCost()).not.toHaveText(increasedCost);
    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
  });
});
