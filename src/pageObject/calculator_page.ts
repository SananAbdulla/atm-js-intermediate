import { BasePage } from './BasePage';

// TODO: Add more selectors

export class CalculatorPage extends BasePage {
  constructor() {
    super('/products/calculator');
  }

  welcomeElement() {
    return $$('.Gxwdcd');
  }

  async dismissCookieBanner() {
    const selectors = [
      'button[aria-label="Dismiss"]',
      '//*[text()="OK, got it"]',
      '//*[text()="OK"]',
    ];

    for (const selector of selectors) {
      const button = await $(selector);
      if (await button.isExisting() && await button.isDisplayed()) {
        await button.click();
        return;
      }
    }
  }

  async addEstimateButton() {
    const welcomeElement = await this.welcomeElement();
    return welcomeElement[0]!.$('//span[text()="Add to estimate"]');
  }

  addEstimationModalWindow() {
    return $('[aria-label="Add to this estimate"]');
  }

  viewDetailsButton() {
    return $('//*[text()="View details"]');
  }

  configurationBlock() {
    return $('h2*=Instances configuration');
  }

  monthlyCost() {
    return $('.egBpsb .D0aEmf');
  }

  incrementInstancesButton() {
    return $('.QiFlid [aria-label="Increment"]');
  }

  async addInstances(count: number) {
    const incrementButton = await this.incrementInstancesButton();
    await incrementButton.waitForExist({ timeout: 10000 });
    await incrementButton.scrollIntoView();

    for (let i = 0; i < count; i++) {
      await browser.execute((button) => button.click(), incrementButton);
      await browser.pause(300);
    }
  }
}
