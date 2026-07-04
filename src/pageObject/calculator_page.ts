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

  async addEstimateButton(): Promise<WebdriverIO.Element> {
    return $('//button[.//span[normalize-space()="Add to estimate"]]');
  }

  async addEstimationModalWindow(): Promise<WebdriverIO.Element> {
    return $('[aria-label="Add to this estimate"]');
  }

  async computeEngineOption(): Promise<WebdriverIO.Element> {
    return $('//h2[normalize-space()="Compute Engine"]');
  }

  async configurationBlock(): Promise<WebdriverIO.Element> {
    return $('h2*=Instances configuration');
  }

  async monthlyCost(): Promise<WebdriverIO.Element> {
    return $('.egBpsb .D0aEmf');
  }

  async incrementInstancesButton(): Promise<WebdriverIO.Element> {
    const buttons = await $$('[aria-label="Increment"]');
    return buttons[0]!;
  }

  async pageHeading(): Promise<WebdriverIO.Element> {
    return $('h1*=pricing calculator');
  }

  async addComputeEngineEstimate(): Promise<void> {
    const addButton = await this.addEstimateButton();
    await addButton.waitForClickable();
    await addButton.click();

    const modal = await this.addEstimationModalWindow();
    await modal.waitForDisplayed();

    const computeEngine = await this.computeEngineOption();
    await computeEngine.waitForClickable();
    await computeEngine.click();

    const viewDetails = await $('button=View details');
    if (await viewDetails.isDisplayed().catch(() => false)) {
      await viewDetails.click();
    }

    const config = await this.configurationBlock();
    await config.waitForDisplayed({ timeout: 15000 });
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = await this.incrementInstancesButton();
    await incrementButton.waitForDisplayed();
    await incrementButton.scrollIntoView();

    for (let i = 0; i < count; i++) {
      await browser.execute('arguments[0].click();', incrementButton);
    }
  }

  async getMonthlyCostText(): Promise<string> {
    const cost = await this.monthlyCost();
    await cost.waitForDisplayed();
    return (await cost.getText()).trim();
  }
}
