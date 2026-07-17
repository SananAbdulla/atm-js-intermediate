import 'dotenv/config';
import { CalculatorPage } from '../../pageObject/CalculatorPage';

const calculatorPage = new CalculatorPage();
const costPattern = /^\$\d+\.\d{2}$/;

describe('Cloud Calculator', () => {
  beforeEach(async () => {
    await calculatorPage.open();
    await calculatorPage.dismissCookieBanner();
  });

  it('should display the pricing calculator page', async () => {
    await expect(browser).toHaveUrl(`${browser.config.baseUrl}/products/calculator`);
    await expect(calculatorPage.pageHeading()).toBeDisplayed();
    await expect(calculatorPage.addEstimateButton()).toBeDisplayed();
  });

  it('should open the add estimate dialog with Compute Engine option', async () => {
    const addButton = await calculatorPage.addEstimateButton();
    await addButton.click();

    await expect(calculatorPage.addEstimationModalWindow()).toBeDisplayed();
    await expect(calculatorPage.computeEngineOption()).toBeDisplayed();
  });

  it('should add a Compute Engine estimate to the calculator', async () => {
    await calculatorPage.addComputeEngineEstimate();

    await expect(calculatorPage.configurationBlock()).toBeDisplayed();
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
