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
}
