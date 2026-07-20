# ATM JS Intermediate — Test Automation Framework

Smoke and visual tests for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator?hl=en).

Built with Playwright, TypeScript, and the Page Object Model.

## Prerequisites

- Node.js 18+ (see `.nvmrc`)
- npm 9+

```bash
node -v
nvm use
```

## Setup

```bash
npm install
npx playwright install chromium
```

Optional `.env` file:

```env
BASE_URL=https://cloud.google.com

# Optional Report Portal integration
RP_API_KEY=your_api_key
RP_ENDPOINT=https://reportportal.epam.com/api/v1
RP_PROJECT=your_project_name
RP_LAUNCH=ATM Playwright Tests
```

## Running tests

```bash
npm test
npm run test:visual
npm run test:visual:update
npm run test:report
```

Update baseline screenshots after intentional UI changes:

```bash
npm run test:visual:update
```

## Project structure

```
src/pages/
  BasePage.ts
  CalculatorPage.ts

tests/
  fixtures/
    calculator.fixture.ts
  smoke/
    cloud-calculator.spec.ts
  visual/
    calculator-visual.spec.ts
    calculator-visual.spec.ts-snapshots/

playwright.config.ts
tsconfig.json
```

## Configuration

| Setting              | Value                                      |
|----------------------|--------------------------------------------|
| Base URL             | `https://cloud.google.com` (`BASE_URL` env) |
| Calculator path      | `/products/calculator?hl=en`               |
| Browser              | Chromium                                   |
| Visual tolerance     | `maxDiffPixels: 100`                       |
| Console reporter     | `line`                                     |
| HTML report          | `playwright-report/`                       |

When a screenshot test fails, open `npm run test:report` to compare expected, actual, and diff images in the HTML report.

## Troubleshooting

| Problem           | Fix                                      |
|-------------------|------------------------------------------|
| Node version      | Run `nvm use`                            |
| Browser not found | Run `npx playwright install chromium`    |
| Cookie banner     | Handled in the calculator fixture        |
| Snapshot mismatch | Run `npm run test:visual:update` locally |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
