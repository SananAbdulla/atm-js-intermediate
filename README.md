# ATM JS Intermediate — Playwright TAF

Educational test automation project for the Google Cloud pricing calculator, built with **Playwright** and the **Page Object Model**.

## Tech stack

| Tool | Purpose |
|------|---------|
| [Playwright Test](https://playwright.dev/) | Test runner and browser automation |
| TypeScript | Typed page objects and specs |
| Page Object Model | Maintainable UI abstractions |

## Prerequisites

- **Node.js 18+** (recommended: 20 or 22)
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

Optional environment variables (`.env`):

```env
BASE_URL=https://cloud.google.com
```

## Running tests

```bash
# Run all tests (headless)
npm test

# Run with visible browser
npm run test:headed

# Interactive UI mode
npm run test:ui

# Open last HTML report
npm run test:report
```

Run a specific suite:

```bash
npx playwright test tests/smoke
npx playwright test tests/samples
```

## Project structure

```
src/pages/              # Page Object classes
  BasePage.ts           # Shared navigation helper
  CalculatorPage.ts     # Google Cloud calculator page

tests/
  fixtures/             # Playwright test fixtures
  samples/              # Introductory Playwright examples
  smoke/                # Smoke and regression tests

playwright.config.ts    # Playwright configuration
```

## Page Object pattern

Page objects receive a Playwright `Page` instance and expose locators and actions:

```typescript
const calculatorPage = new CalculatorPage(page);
await calculatorPage.open();
await calculatorPage.dismissCookieBanner();
await calculatorPage.addComputeEngineEstimate();
```

Locators use Playwright's recommended selectors (`getByRole`, `getByLabel`, `getByText`) with auto-waiting built in.

## Configuration highlights

- **Base URL**: `https://cloud.google.com` (overridable via `BASE_URL`)
- **Parallel execution**: enabled via `fullyParallel`
- **Reporter**: `list` (essential console output only)
- **Artifacts**: screenshots on failure, traces on retry

## Disclaimer

> This is an educational project.  
> Do not consider current solutions as the only correct ones or ready for production use.
