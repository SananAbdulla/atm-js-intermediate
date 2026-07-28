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
      description: 'ATM Playwright Tests',
      uploadTrace: true,
      uploadVideo: true,
    },
  ]);
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 120_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: reporters,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03,
    },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/visual/desmos-*.spec.ts', '**/mobile/**'],
    },
    {
      name: 'desmos-chromium',
      testMatch: '**/visual/desmos-*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.desmos.com',
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'desmos-firefox',
      testMatch: '**/visual/desmos-*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://www.desmos.com',
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
      },
    },
  ],
});
