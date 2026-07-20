import { test, expect } from '../fixtures/calculator.fixture';
import {
  costsMatch,
  extractTotalPriceUsd,
  validateEstimateLineItems,
} from '../../src/utils/estimateCsvValidator';

test.describe('Export estimate as CSV', () => {
  test('should export CSV with valid format and content matching the UI', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();

    const uiMonthlyCost = await calculatorPage.getMonthlyCostText();
    expect(uiMonthlyCost).toMatch(/^\$\d+\.\d{2}$/);

    const { content, download } = await calculatorPage.downloadEstimateCsv();
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
    expect(content).toContain('service_display_name,name,quantity,region,service_id,sku');

    const lineItems = await validateEstimateLineItems(content);
    expect(lineItems.every((item) => item.serviceDisplayName.includes('Compute Engine'))).toBe(
      true,
    );

    const csvTotalUsd = extractTotalPriceUsd(content);
    expect(costsMatch(uiMonthlyCost, csvTotalUsd)).toBe(true);

    const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.totalPriceUsd, 0);
    expect(Math.abs(lineItemsTotal - csvTotalUsd)).toBeLessThan(0.02);
  });
});
