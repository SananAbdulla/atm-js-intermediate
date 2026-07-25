import fs from 'fs';
import { test, expect } from '../fixtures/calculator.fixture';
import {
  costsMatch,
  EXPECTED_CSV_COLUMN_COUNT,
  EXPECTED_CSV_HEADERS,
  EXPECTED_CSV_ROW_COUNT,
  extractTotalPriceUsd,
  getCsvColumnCount,
  getCsvHeaders,
  getCsvRowCount,
  validateEstimateLineItems,
} from '../../src/utils/estimateCsvValidator';

test.describe('Export estimate as CSV', () => {
  test('should export CSV with valid format and content matching the UI', async ({
    calculatorPage,
  }) => {
    await calculatorPage.addComputeEngineEstimate();

    const uiMonthlyCost = await calculatorPage.getMonthlyCostText();
    expect(uiMonthlyCost).toMatch(/^\$\d+\.\d{2}$/);

    const { content, download, filePath } = await calculatorPage.downloadEstimateCsv();

    try {
      expect(download.suggestedFilename()).toMatch(/\.csv$/i);

      const headers = getCsvHeaders(content);
      expect(headers).toEqual([...EXPECTED_CSV_HEADERS]);
      expect(headers).toContain('total_price, USD');
      expect(getCsvColumnCount(content)).toBe(EXPECTED_CSV_COLUMN_COUNT);
      expect(getCsvRowCount(content)).toBe(EXPECTED_CSV_ROW_COUNT);

      const lineItems = await validateEstimateLineItems(content);
      expect(lineItems.every((item) => item.serviceDisplayName.includes('Compute Engine'))).toBe(
        true,
      );

      const csvTotalUsd = extractTotalPriceUsd(content);
      expect(costsMatch(uiMonthlyCost, csvTotalUsd)).toBe(true);

      const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.totalPriceUsd, 0);
      expect(Math.abs(lineItemsTotal - csvTotalUsd)).toBeLessThan(0.02);
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      expect(fs.existsSync(filePath)).toBe(false);
    }
  });
});
