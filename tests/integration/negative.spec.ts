import { test, expect } from '../fixtures/calculator.fixture';
import { computeEngineEstimateConfig } from '../test-data/compute-engine.data';

test.describe('Negative scenarios', () => {
  test('should not calculate monthly cost when instance count is zero', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(computeEngineEstimateConfig);

    const previousCost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.setInstanceCount(0);
    await expect
      .poll(async () => calculatorPage.getMonthlyCostText(), { timeout: 60_000 })
      .not.toBe(previousCost);
    await calculatorPage.waitForStableMonthlyCost({ allowPlaceholder: true });

    await expect(calculatorPage.monthlyCost()).toHaveText('--');
  });

  test('should not calculate monthly cost when boot disk size is negative', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(computeEngineEstimateConfig);

    const previousCost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.setBootDiskSize(-1);
    await expect
      .poll(async () => calculatorPage.getMonthlyCostText(), { timeout: 60_000 })
      .not.toBe(previousCost);
    await calculatorPage.waitForStableMonthlyCost({ allowPlaceholder: true });

    await expect(calculatorPage.monthlyCost()).toHaveText('--');
  });
});
