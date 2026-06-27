import "dotenv/config";
import { CalculatorPage } from "../../pageObject/calculator_page";
const chai = require('chai');

const calculatorPage = new CalculatorPage();

describe('Cloud Calculator', () => {
  before(async () => {
    // @ts-ignore
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
  });

  it('Should be able to add new entities into the calculator', async () => {
    console.log('First test');

    // @ts-ignore
    await calculatorPage.open();

    const url = await browser.getUrl();
    chai.expect(url).to.be.equal(browser.config.baseUrl + '/products/calculator');

    await expect(calculatorPage.addEstimateButton()).toBeDisplayed();

    const addEstimateButton = await calculatorPage.addEstimateButton();
    await addEstimateButton.click();

    const addEstimationModalWindow = await calculatorPage.addEstimationModalWindow();

    await browser.pause(150);
    chai.expect(await addEstimationModalWindow.isDisplayed()).to.be.true;

    const computeEngineElement = await $('//h2[text()="Compute Engine"]');
    await computeEngineElement.click();

    const viewDetailsButton = await calculatorPage.viewDetailsButton();
    if (await viewDetailsButton.isExisting()) {
      await viewDetailsButton.scrollIntoView();
      await viewDetailsButton.click();
      await browser.pause(500);
    }

    const configurationBlock = await calculatorPage.configurationBlock();
    await configurationBlock.waitForDisplayed({ timeout: 10000 });
    await expect(configurationBlock).toBeDisplayed();
  });

  it("Should be able to add two new instances", async () => {
    console.log(`Second test`);

    await calculatorPage.addInstances(2);

    const threeInstancesCostUSD = '$201.03';
    await expect(calculatorPage.monthlyCost()).toHaveText(threeInstancesCostUSD);
  });
});
