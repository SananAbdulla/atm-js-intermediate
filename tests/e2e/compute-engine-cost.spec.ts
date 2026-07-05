import { test, expect } from '../fixtures/calculator.fixture';

const standardConfig = {
  series: 'N1',
  machineType: 'n1-standard-1',
  operatingSystem: /Ubuntu Pro/,
  region: /Frankfurt.*europe-west3/,
  bootDiskSizeGiB: 100,
  instanceCount: 2,
};

test.describe('Compute Engine cost estimation', () => {
  test('should estimate monthly cost for n1-standard-1 with Ubuntu Pro in Frankfurt', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(standardConfig);

    await expect(calculatorPage.monthlyCost()).toHaveText(/\$\d+\.\d{2}/);
    const cost = calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText());
    expect(cost).toBeGreaterThan(0);
  });

  test('should show higher cost for n1-standard-2 than n1-standard-1', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine(standardConfig);

    const standard1Cost = calculatorPage.parseMonthlyCost(
      await calculatorPage.getMonthlyCostText(),
    );

    await calculatorPage.selectMachineType('n1-standard-2');

    await expect
      .poll(async () => calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText()))
      .toBeGreaterThan(standard1Cost);
  });

  test('should increase cost when boot disk size is enlarged', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine({
      ...standardConfig,
      bootDiskSizeGiB: 10,
    });

    const smallDiskCost = calculatorPage.parseMonthlyCost(
      await calculatorPage.getMonthlyCostText(),
    );

    await calculatorPage.setBootDiskSize(500);

    await expect
      .poll(async () => calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText()))
      .toBeGreaterThan(smallDiskCost);
  });

  test('should increase cost when instance count is raised', async ({ calculatorPage }) => {
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.configureStandardComputeEngine({
      ...standardConfig,
      instanceCount: 1,
    });

    const singleInstanceCost = calculatorPage.parseMonthlyCost(
      await calculatorPage.getMonthlyCostText(),
    );

    await calculatorPage.setInstanceCount(3);

    await expect
      .poll(async () => calculatorPage.parseMonthlyCost(await calculatorPage.getMonthlyCostText()))
      .toBeGreaterThan(singleInstanceCost);
  });

  test('should not add estimate when add dialog is cancelled', async ({ calculatorPage }) => {
    await calculatorPage.addEstimateButton().click();
    await expect(calculatorPage.addEstimationModalWindow()).toBeVisible();

    await calculatorPage.page.keyboard.press('Escape');
    await expect(calculatorPage.addEstimationModalWindow()).toBeHidden();
    await expect(calculatorPage.configurationBlock()).toBeHidden();
  });
});
