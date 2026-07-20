import { test, expect } from '../fixtures/calculator.fixture';

test.describe('Calculator screenshot tests', () => {
  test('calculator page matches baseline screenshot', async ({ page, calculatorPage }) => {
    await expect(calculatorPage.pageHeading()).toBeVisible();

    await expect(page).toHaveScreenshot('calculator-page.png');
  });

  test('get started section matches baseline screenshot', async ({ calculatorPage }) => {
    await expect(calculatorPage.getStartedSection()).toHaveScreenshot('get-started-section.png');
  });

  test('service selection panel matches baseline screenshot', async ({ calculatorPage }) => {
    await calculatorPage.openAddEstimateDialog();

    await expect(calculatorPage.serviceSelectionPanel()).toHaveScreenshot(
      'service-selection-panel.png',
    );
  });

  test('compute engine configuration matches baseline screenshot', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.instancesConfigurationPanel()).toHaveScreenshot(
      'compute-engine-configuration.png',
      { mask: [calculatorPage.monthlyCost()] },
    );
  });
});
