import CSVFileValidator, { ValidatorConfig } from 'csv-file-validator';

export type EstimateLineItem = {
  serviceDisplayName: string;
  name: string;
  quantity: number;
  region: string;
  serviceId: string;
  sku: string;
  totalPriceUsd: number;
  notes?: string | null;
};

const COMPUTE_ENGINE_LINE_PREFIX = 'Instances (Compute Engine)';

const lineItemConfig: ValidatorConfig = {
  headers: [
    {
      name: 'service_display_name',
      inputName: 'serviceDisplayName',
      required: true,
      validate: (value) =>
        typeof value === 'string' && value.includes('Compute Engine'),
    },
    {
      name: 'name',
      inputName: 'name',
      required: true,
      validate: (value) => typeof value === 'string' && value.length > 0,
    },
    {
      name: 'quantity',
      inputName: 'quantity',
      required: true,
      validate: (value) => typeof value === 'number' && value > 0,
    },
    {
      name: 'region',
      inputName: 'region',
      required: true,
      validate: (value) => typeof value === 'string' && value.length > 0,
    },
    {
      name: 'service_id',
      inputName: 'serviceId',
      required: true,
      validate: (value) => typeof value === 'string' && value.length > 0,
    },
    {
      name: 'sku',
      inputName: 'sku',
      required: true,
      validate: (value) => typeof value === 'string' && value.length > 0,
    },
    {
      name: 'total_price, USD',
      inputName: 'totalPriceUsd',
      required: true,
      validate: (value) => typeof value === 'number' && value >= 0,
    },
    { name: 'notes', inputName: 'notes', optional: true },
  ],
  parserConfig: { dynamicTyping: true },
};

export function extractLineItemsSection(csvContent: string): string {
  const lines = csvContent.trim().split('\n');
  const header = lines[0];
  const itemLines = lines.slice(1).filter((line) => line.startsWith(COMPUTE_ENGINE_LINE_PREFIX));

  return [header, ...itemLines].join('\n');
}

export function extractTotalPriceUsd(csvContent: string): number {
  const match = csvContent.match(/Total Price:,(\d+(?:\.\d+)?)/);

  if (!match?.[1]) {
    throw new Error('Total Price row not found in exported CSV');
  }

  return parseFloat(match[1]);
}

export function parseCostAmount(costText: string): number {
  const match = costText.match(/\$([\d,]+\.\d{2})/);

  if (!match?.[1]) {
    throw new Error(`Unable to parse cost from UI text: "${costText}"`);
  }

  return parseFloat(match[1].replace(/,/g, ''));
}

export function costsMatch(uiCostText: string, csvTotalUsd: number): boolean {
  const uiAmount = parseCostAmount(uiCostText);
  return Math.abs(uiAmount - csvTotalUsd) < 0.02;
}

export async function validateEstimateLineItems(
  csvContent: string,
): Promise<EstimateLineItem[]> {
  const section = extractLineItemsSection(csvContent);

  if (!section.includes(COMPUTE_ENGINE_LINE_PREFIX)) {
    throw new Error('Exported CSV does not contain Compute Engine line items');
  }

  const result = await CSVFileValidator<EstimateLineItem>(section, lineItemConfig);

  if (result.inValidData.length > 0) {
    const messages = result.inValidData.map((item) => item.message).join('; ');
    throw new Error(`CSV format validation failed: ${messages}`);
  }

  if (result.data.length === 0) {
    throw new Error('Exported CSV does not contain any validated line items');
  }

  return result.data;
}
