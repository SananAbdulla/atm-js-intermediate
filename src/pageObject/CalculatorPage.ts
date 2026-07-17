import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor() {
    super('/products/calculator');
  }

  async dismissCookieBanner(): Promise<void> {
    const selectors = ['button=Dismiss', 'button=OK, got it', 'button=OK'];

    for (const selector of selectors) {
      const button = await $(selector);
      if (await button.isDisplayed().catch(() => false)) {
        await button.click();
        return;
      }
    }
  }

  addEstimateButton() {
    return $('//button[.//span[normalize-space()="Add to estimate"]]');
  }

  addEstimationModalWindow() {
    return $('[aria-label="Add to this estimate"]');
  }

  computeEngineOption() {
    return $('//h2[normalize-space()="Compute Engine"]');
  }

  configurationBlock() {
    return $('h2*=Instances configuration');
  }

  monthlyCost() {
    return $('.egBpsb .D0aEmf');
  }

  incrementInstancesButton() {
    return $(
      '//h2[contains(., "Instances configuration")]/ancestor::div[.//button[@aria-label="Increment"]]//button[@aria-label="Increment"]',
    );
  }

  pageHeading() {
    return $('h1*=pricing calculator');
  }

  viewDetailsButton() {
    return $('button=View details');
  }

  async addComputeEngineEstimate(): Promise<void> {
    const addButton = await this.addEstimateButton();
    await addButton.waitForClickable({ timeout: 10000 });
    await addButton.click();

    await (await this.addEstimationModalWindow()).waitForDisplayed();

    const computeEngine = await this.computeEngineOption();
    await computeEngine.waitForClickable({ timeout: 10000 });
    await computeEngine.click();

    const viewDetails = await this.viewDetailsButton();
    if (await viewDetails.isDisplayed().catch(() => false)) {
      await viewDetails.click();
    }

    await (await this.configurationBlock()).waitForDisplayed({ timeout: 15000 });
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = await this.incrementInstancesButton();
    await incrementButton.waitForDisplayed();
    await incrementButton.scrollIntoView();

    for (let i = 0; i < count; i++) {
      await incrementButton.click();
    }
  }

  async getMonthlyCostText(): Promise<string> {
    const cost = await this.monthlyCost();
    await cost.waitForDisplayed();
    return (await cost.getText()).trim();
  }
}
