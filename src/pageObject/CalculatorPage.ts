import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor() {
    super('/products/calculator');
  }

  cookieAcceptButton() {
    return $('button=OK, got it');
  }

  async dismissCookieBanner(): Promise<void> {
    const acceptButton = await this.cookieAcceptButton();
    if (await acceptButton.isDisplayed().catch(() => false)) {
      await acceptButton.click();
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

  async openAddEstimateDialog(): Promise<void> {
    const addButton = await this.addEstimateButton();
    await addButton.waitForClickable({ timeout: browser.options.waitforTimeout });
    await addButton.click();
    await (await this.addEstimationModalWindow()).waitForDisplayed({
      timeout: browser.options.waitforTimeout,
    });
  }

  async selectComputeEngine(): Promise<void> {
    const computeEngine = await this.computeEngineOption();
    await computeEngine.waitForClickable({ timeout: browser.options.waitforTimeout });
    await computeEngine.click();
  }

  async openInstanceConfiguration(): Promise<void> {
    const viewDetails = await this.viewDetailsButton();
    await viewDetails.waitForClickable({ timeout: browser.options.waitforTimeout });
    await viewDetails.click();
    await (await this.configurationBlock()).waitForDisplayed({
      timeout: browser.options.waitforTimeout,
    });
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.openAddEstimateDialog();
    await this.selectComputeEngine();
    await (await this.configurationBlock()).waitForDisplayed({
      timeout: browser.options.waitforTimeout,
    });
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = await this.incrementInstancesButton();
    await incrementButton.waitForDisplayed({ timeout: browser.options.waitforTimeout });

    for (let i = 0; i < count; i++) {
      await incrementButton.scrollIntoView({ block: 'center', inline: 'nearest' });
      await incrementButton.waitForClickable({ timeout: browser.options.waitforTimeout });
      await incrementButton.click();
    }
  }
}
