import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/products/calculator');
  }

  async dismissCookieBanner(): Promise<void> {
    const candidates = [
      this.page.getByRole('button', { name: 'Dismiss' }),
      this.page.getByText('OK, got it'),
      this.page.getByText('OK', { exact: true }),
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
    return this.page.getByLabel('Add to this estimate');
  }

  computeEngineOption(): Locator {
    return this.page.getByRole('heading', { name: 'Compute Engine' });
  }

  viewDetailsButton(): Locator {
    return this.page.getByText('View details');
  }

  configurationBlock(): Locator {
    return this.page.getByRole('heading', { name: /Instances configuration/i });
  }

  monthlyCost(): Locator {
    return this.page.locator('.egBpsb .D0aEmf');
  }

  incrementInstancesButton(): Locator {
    return this.page.locator('.QiFlid [aria-label="Increment"]');
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

    const viewDetails = this.viewDetailsButton();
    if (await viewDetails.isVisible().catch(() => false)) {
      await viewDetails.click();
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
}
