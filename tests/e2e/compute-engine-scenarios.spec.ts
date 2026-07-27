import { test, expect } from '../fixtures/calculator.fixture';
import { computeEngineEstimateConfig, expectedCosts } from '../test-data/compute-engine.data';

test.describe('User Scenario: Estimate Compute Engine cost', () => {
  test('should display the expected monthly cost for n1-standard-1 configuration', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(computeEngineEstimateConfig);

    await expect(calculatorPage.monthlyCost()).toHaveText(expectedCosts.n1Standard1Monthly);
  });
});

test.describe('User Scenario: Compare Compute Engine configurations', () => {
  test('should update the monthly cost when machine type changes to n1-standard-2', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(computeEngineEstimateConfig);

    await expect(calculatorPage.monthlyCost()).toHaveText(expectedCosts.n1Standard1Monthly);

    const standard1Cost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.selectMachineType('n1-standard-2');
    await calculatorPage.waitForMonthlyCostChange(standard1Cost);

    await expect(calculatorPage.monthlyCost()).toHaveText(expectedCosts.n1Standard2Monthly);
  });
});
