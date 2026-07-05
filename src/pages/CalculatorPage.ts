import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/products/calculator');
  }

  async dismissCookieBanner(): Promise<void> {
    const candidates = [
      this.page.getByRole('button', { name: 'Dismiss' }),
      this.page.getByRole('button', { name: 'OK, got it' }),
      this.page.getByRole('button', { name: 'OK', exact: true }),
    ];

    for (const button of candidates) {
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        return;
      }
    }
  }

  addEstimateButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to estimate' }).first();
  }

  addEstimationModalWindow(): Locator {
    return this.page.getByRole('heading', { name: 'Add to this estimate' });
  }

  computeEngineOption(): Locator {
    return this.page.getByRole('heading', { name: 'Compute Engine', exact: true });
  }

  viewDetailsButton(): Locator {
    return this.page.getByRole('button', { name: 'View details' });
  }

  configurationBlock(): Locator {
    return this.page.getByRole('heading', { name: /Instances configuration/i });
  }

  monthlyCost(): Locator {
    return this.page.locator('.egBpsb .D0aEmf');
  }

  incrementInstancesButton(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.configurationBlock() })
      .getByRole('button', { name: 'Increment' })
      .first();
  }

  decrementInstancesButton(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.configurationBlock() })
      .getByRole('button', { name: 'Decrement' })
      .first();
  }

  pageHeading(): Locator {
    return this.page.getByRole('heading', {
      name: /Welcome to Google Cloud.*pricing calculator/i,
    });
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.addEstimateButton().click();
    await this.addEstimationModalWindow().waitFor({ state: 'visible' });
    await this.computeEngineOption().click();

    if (
      await this.viewDetailsButton()
        .isVisible()
        .catch(() => false)
    ) {
      await this.viewDetailsButton().click();
    }

    await this.configurationBlock().waitFor({ state: 'visible' });
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = this.incrementInstancesButton();
    await incrementButton.scrollIntoViewIfNeeded();

    for (let i = 0; i < count; i++) {
      await incrementButton.click();
    }
  }

  async removeInstances(count: number): Promise<void> {
    const decrementButton = this.decrementInstancesButton();
    await decrementButton.scrollIntoViewIfNeeded();

    for (let i = 0; i < count; i++) {
      await decrementButton.click();
    }
  }

  async getMonthlyCostText(): Promise<string> {
    const text = await this.monthlyCost().textContent();
    return text?.trim() ?? '';
  }

  parseMonthlyCost(costText: string): number {
    const match = costText.match(/\$([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(',', '')) : NaN;
  }

  private async selectComboboxOption(
    comboboxName: string,
    optionMatcher: RegExp | string,
  ): Promise<void> {
    await this.page.getByRole('combobox', { name: comboboxName }).click();
    const option =
      typeof optionMatcher === 'string'
        ? this.page.getByRole('option', { name: optionMatcher })
        : this.page.getByRole('option').filter({ hasText: optionMatcher }).first();
    await option.click();
  }

  async selectSeries(series: string): Promise<void> {
    await this.selectComboboxOption('Series', new RegExp(`^${series}`));
  }

  async selectMachineType(machineType: string): Promise<void> {
    await this.page.getByRole('combobox', { name: 'Machine type' }).click();
    await this.page.locator(`[role="option"][data-value="${machineType}"]`).click();
  }

  async selectOperatingSystem(operatingSystem: RegExp | string): Promise<void> {
    await this.selectComboboxOption('Operating System / Software', operatingSystem);
  }

  async selectRegion(region: RegExp | string): Promise<void> {
    await this.selectComboboxOption('Region', region);
  }

  async setBootDiskSize(gib: number): Promise<void> {
    await this.page.getByRole('spinbutton', { name: /Boot disk size/ }).fill(String(gib));
  }

  async setInstanceCount(count: number): Promise<void> {
    await this.page.getByRole('spinbutton', { name: /Number of instances/ }).fill(String(count));
  }

  async configureStandardComputeEngine(options: {
    series: string;
    machineType: string;
    operatingSystem: RegExp | string;
    region: RegExp | string;
    bootDiskSizeGiB: number;
    instanceCount: number;
  }): Promise<void> {
    await this.selectSeries(options.series);
    await this.selectMachineType(options.machineType);
    await this.selectOperatingSystem(options.operatingSystem);
    await this.selectRegion(options.region);
    await this.setBootDiskSize(options.bootDiskSizeGiB);
    await this.setInstanceCount(options.instanceCount);
  }
}
