# ATM JS Intermediate — Test Automation Framework

Smoke tests for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator).

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

Optional `.env` file to override the base URL:

```env
BASE_URL=https://cloud.google.com
```

## Running tests

```bash
npm test
npm run test:headed
npm run test:ui
npm run test:report
```

Run a single suite:

```bash
npx playwright test tests/smoke
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

playwright.config.ts
tsconfig.json
```

## Configuration

| Setting      | Value                                      |
|--------------|--------------------------------------------|
| Base URL     | `https://cloud.google.com` (`BASE_URL` env) |
| Browser      | Chromium                                   |
| Parallelism  | Enabled (`fullyParallel`)                  |
| Reporter     | `line`                                     |
| Retries      | 1 in CI, 0 locally                         |

## Troubleshooting

| Problem          | Fix                                      |
|------------------|------------------------------------------|
| Node version     | Run `nvm use`                            |
| Browser not found| Run `npx playwright install chromium`    |
| Cookie banner    | Handled in the calculator fixture        |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
