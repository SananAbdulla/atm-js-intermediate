import { test, expect } from '../fixtures/calculator.fixture';
import { computeEngineEstimateConfig } from '../test-data/compute-engine.data';

test.describe('Edge scenarios', () => {
  test('should calculate a lower cost at the minimum boot disk boundary of 10 GiB', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine({
      ...computeEngineEstimateConfig,
      bootDiskSizeGiB: 100,
    });

    const disk100CostText = await calculatorPage.getMonthlyCostText();
    const disk100Cost = calculatorPage.parseMonthlyCost(disk100CostText);

    await calculatorPage.setBootDiskSize(10);
    await calculatorPage.waitForMonthlyCostChange(disk100CostText);

    await expect
      .poll(async () => calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText()))
      .toBeLessThan(disk100Cost);
  });

  test('should calculate a higher cost when boot disk moves from 10 GiB to 100 GiB', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine({
      ...computeEngineEstimateConfig,
      bootDiskSizeGiB: 10,
    });

    const disk10CostText = await calculatorPage.getMonthlyCostText();
    const disk10Cost = calculatorPage.parseMonthlyCost(disk10CostText);

    await calculatorPage.setBootDiskSize(100);
    await calculatorPage.waitForMonthlyCostChange(disk10CostText);

    await expect
      .poll(async () => calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText()))
      .toBeGreaterThan(disk10Cost);
  });
});
