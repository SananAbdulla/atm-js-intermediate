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

export const EXPECTED_CSV_HEADERS = [
  'service_display_name',
  'name',
  'quantity',
  'region',
  'service_id',
  'sku',
  'total_price, USD',
  'notes',
] as const;

export const EXPECTED_CSV_COLUMN_COUNT = EXPECTED_CSV_HEADERS.length;

/** Default Compute Engine estimate export row count (header + line items + totals/footer). */
export const EXPECTED_CSV_ROW_COUNT = 12;

const lineItemConfig: ValidatorConfig = {
  headers: [
    {
      name: 'service_display_name',
      inputName: 'serviceDisplayName',
      required: true,
      validate: (value) => typeof value === 'string' && value.includes('Compute Engine'),
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

export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

export function getCsvRows(csvContent: string): string[] {
  return csvContent.split(/\r?\n/).filter((line) => line.length > 0);
}

export function getCsvHeaders(csvContent: string): string[] {
  const rows = getCsvRows(csvContent);
  if (rows.length === 0) {
    throw new Error('Exported CSV is empty');
  }

  return parseCsvLine(rows[0]);
}

export function getCsvRowCount(csvContent: string): number {
  return getCsvRows(csvContent).length;
}

export function getCsvColumnCount(csvContent: string): number {
  return getCsvHeaders(csvContent).length;
}

export function extractLineItemsSection(csvContent: string): string {
  const lines = getCsvRows(csvContent);
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

export async function validateEstimateLineItems(csvContent: string): Promise<EstimateLineItem[]> {
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
