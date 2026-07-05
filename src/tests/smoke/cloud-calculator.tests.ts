import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/calculator_page';

const baseUrl = process.env.BASE_URL || 'https://cloud.google.com';
const costPattern = /^\$\d+\.\d{2}$/;

describe('Cloud Calculator', () => {
  let calculatorPage: CalculatorPage;

  beforeEach(async () => {
    calculatorPage = new CalculatorPage();
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
  });

  it('should display the pricing calculator page', async () => {
    await expect(browser).toHaveUrl(`${baseUrl}/products/calculator`);
    await expect(await calculatorPage.pageHeading()).toBeDisplayed();
    await expect(await calculatorPage.addEstimateButton()).toBeDisplayed();
  });

  it('should open the add estimate dialog with Compute Engine option', async () => {
    const addButton = await calculatorPage.addEstimateButton();
    await addButton.click();

    await expect(await calculatorPage.addEstimationModalWindow()).toBeDisplayed();
    await expect(await calculatorPage.computeEngineOption()).toBeDisplayed();
  });

  it('should add a Compute Engine estimate to the calculator', async () => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(await calculatorPage.configurationBlock()).toBeDisplayed();
    await browser.waitUntil(async () => costPattern.test(await calculatorPage.getMonthlyCostText()));
  });

  it('should increase monthly cost when instances are added', async () => {
    await calculatorPage.addComputeEngineEstimate();

    const initialCost = await calculatorPage.getMonthlyCostText();
    await calculatorPage.addInstances(2);

    await browser.waitUntil(async () => {
      const updatedCost = await calculatorPage.getMonthlyCostText();
      return updatedCost !== initialCost && costPattern.test(updatedCost);
    });
  });
});
