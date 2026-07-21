import { defineConfig, devices } from '@playwright/test';
import type { ReporterDescription } from '@playwright/test/reporter';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL ?? 'https://cloud.google.com';

const reporters: ReporterDescription[] = [
  ['line'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ['junit', { outputFile: 'test-results/junit-report.xml' }],
];

if (process.env.RP_API_KEY) {
  reporters.push([
    '@reportportal/agent-js-playwright',
    {
      apiKey: process.env.RP_API_KEY,
      endpoint: process.env.RP_ENDPOINT,
      project: process.env.RP_PROJECT,
      launch: process.env.RP_LAUNCH ?? 'ATM Playwright Tests',
      description: 'Google Cloud calculator tests',
      uploadTrace: true,
      uploadVideo: true,
    },
  ]);
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: reporters,
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixels: 1500,
    },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
