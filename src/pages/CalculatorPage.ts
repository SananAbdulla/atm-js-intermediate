import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/products/calculator?hl=en');
  }

  cookieAcceptButton(): Locator {
    return this.page.getByRole('button', { name: 'OK, got it' });
  }

  async dismissCookieBanner(): Promise<void> {
    const acceptButton = this.cookieAcceptButton();
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }
  }

  addEstimateButton(): Locator {
    return this.page
      .getByRole('heading', { name: 'Get started with your estimate' })
      .locator('xpath=ancestor::div[1]')
      .getByRole('button', { name: 'Add to estimate' });
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
    return this.page
      .getByText(/Estimated cost/)
      .locator('xpath=ancestor::*[contains(normalize-space(.), "/ mo")][1]')
      .getByText(/^\$\d+\.\d{2}$/);
  }

  incrementInstancesButton(): Locator {
    return this.page
      .getByText('Number of instances*', { exact: true })
      .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]')
      .getByRole('button', { name: 'Increment' });
  }

  decrementInstancesButton(): Locator {
    return this.page
      .getByText('Number of instances*', { exact: true })
      .locator('xpath=ancestor::div[.//button[@aria-label="Decrement"]][1]')
      .getByRole('button', { name: 'Decrement' });
  }

  pageHeading(): Locator {
    return this.page.getByRole('heading', {
      name: /Welcome to Google Cloud.*pricing calculator/i,
    });
  }

  getStartedSection(): Locator {
    return this.page
      .getByRole('heading', { name: 'Get started with your estimate' })
      .locator('xpath=ancestor::div[1]');
  }

  serviceSelectionPanel(): Locator {
    return this.page
      .getByRole('heading', { name: 'Add to this estimate' })
      .locator('xpath=ancestor::div[.//h2[normalize-space()="Compute Engine"]][1]');
  }

  instancesConfigurationPanel(): Locator {
    return this.page
      .getByRole('heading', { name: /Instances configuration/i })
      .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]');
  }

  async openAddEstimateDialog(): Promise<void> {
    await this.addEstimateButton().click();
    await this.addEstimationModalWindow().waitFor({ state: 'visible' });
  }

  async selectComputeEngine(): Promise<void> {
    await this.computeEngineOption().click();
  }

  async openInstanceConfiguration(): Promise<void> {
    await this.viewDetailsButton().click();
    await this.configurationBlock().waitFor({ state: 'visible' });
  }

  async closeAddEstimateDialog(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.addEstimationModalWindow().waitFor({ state: 'hidden' });
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.openAddEstimateDialog();
    await this.selectComputeEngine();
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

  priceLabels(): Locator {
    return this.page.getByText(/\$\d+[\d,]*\.\d{2}/);
  }

  chatConfigureButton(): Locator {
    return this.page.getByRole('button', { name: /Chat to configure/i });
  }

  async prepareForScreenshot(): Promise<void> {
    await this.dismissCookieBanner();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.evaluate(async () => {
      await document.fonts.ready;

      await Promise.all(
        [...document.images].map((image) => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
          });
        }),
      );
    });

    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          animation-duration: 0s !important;
          transition: none !important;
          transition-duration: 0s !important;
          caret-color: transparent !important;
        }
      `,
    });
  }

  screenshotMasks(): Locator[] {
    return [this.priceLabels(), this.chatConfigureButton(), this.monthlyCost()];
  }
}
