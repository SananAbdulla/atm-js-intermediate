# ATM JS Intermediate — Playwright Test Automation Framework

Educational test automation framework for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator), built with **Playwright**, **TypeScript**, and the **Page Object Model**.

This project replaces a legacy WebdriverIO setup that relied on brittle XPath/CSS selectors, shared global state, hard-coded pauses, and mixed assertion libraries. The revived framework uses Playwright fixtures, role-based locators, and isolated test setup.

## Tech stack

| Tool | Purpose |
|------|---------|
| [Playwright Test](https://playwright.dev/) | Browser automation and test runner |
| TypeScript | Typed page objects and specs |
| Page Object Model | Encapsulated UI interactions |
| Custom fixtures | Reusable test setup without duplication |

## Prerequisites

- **Node.js 18+** (recommended: 22 — see `.nvmrc`)
- npm 9+

Verify your Node version:

```bash
node -v   # should be v18 or higher
```

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
npx playwright install chromium
```

2. Optional — create a `.env` file to override the base URL:

```env
BASE_URL=https://cloud.google.com
```

## Running tests

```bash
# Run all tests (headless, compact console output)
npm test

# Run with a visible browser
npm run test:headed

# Interactive UI mode
npm run test:ui

# Open the last HTML report (generated on failure/retry)
npm run test:report
```

Run a specific suite:

```bash
npx playwright test tests/smoke
```

## Project structure

```
src/pages/                    # Page Object classes
  BasePage.ts                 # Shared navigation helper
  CalculatorPage.ts           # Google Cloud calculator interactions

tests/
  fixtures/
    calculator.fixture.ts     # Playwright fixture with page setup
  smoke/
    cloud-calculator.spec.ts  # Smoke tests for the calculator

playwright.config.ts          # Playwright configuration
tsconfig.json                 # TypeScript compiler options
.nvmrc                        # Recommended Node.js version
```

## Design patterns

### Page Object Model

Page objects receive a Playwright `Page` instance and expose locators and high-level actions:

```typescript
const calculatorPage = new CalculatorPage(page);
await calculatorPage.open();
await calculatorPage.dismissCookieBanner();
await calculatorPage.addComputeEngineEstimate();
await calculatorPage.addInstances(2);
```

Locators prefer Playwright's user-facing selectors (`getByRole`, `getByText`) instead of auto-generated CSS class names.

### Fixtures instead of global state

The original WebdriverIO tests used a module-level page object and a shared `before` hook. The Playwright fixture creates a fresh `CalculatorPage` per test, opens the page, and dismisses the cookie banner automatically:

```typescript
import { test, expect } from '../fixtures/calculator.fixture';

test('should add a Compute Engine estimate', async ({ calculatorPage }) => {
  await calculatorPage.addComputeEngineEstimate();
  await expect(calculatorPage.configurationBlock()).toBeVisible();
});
```

### Resilient assertions

Tests assert observable behavior (URL, visible elements, cost format, cost changes) rather than hard-coded dollar amounts that may change when Google updates pricing defaults.

## Configuration

| Setting | Value |
|---------|-------|
| Base URL | `https://cloud.google.com` (overridable via `BASE_URL`) |
| Browser | Chromium (Desktop Chrome profile) |
| Parallelism | Enabled (`fullyParallel`) |
| Reporter | `line` — essential pass/fail output only |
| Retries | 1 in CI, 0 locally |
| Artifacts | Screenshots on failure, traces on retry |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Playwright requires Node.js 18 or higher` | Run `nvm use` or upgrade Node.js |
| Browser not found | Run `npx playwright install chromium` |
| Cookie banner blocks clicks | The fixture calls `dismissCookieBanner()` automatically |
| Tests fail on slow network | Re-run; CI enables one retry |

## Disclaimer

> This is an educational project.  
> Do not consider current solutions as the only correct ones or ready for production use.
