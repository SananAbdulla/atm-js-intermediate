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
cp .env.example .env
```

Configure `.env` for optional overrides:

```env
BASE_URL=https://cloud.google.com
RP_API_KEY=your_report_portal_token
RP_ENDPOINT=https://reportportal.epam.com/api/v1
RP_PROJECT=your_personal_project
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

## Linting and formatting

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Reporting

| Reporter | Output | Purpose |
|----------|--------|---------|
| `line` | Console | Essential pass/fail output |
| `html` | `playwright-report/` | HTML report with expected/actual/diff on screenshot failures |
| `junit` | `test-results/junit-report.xml` | CI statistics |
| Report Portal | Remote project | Enabled when `RP_API_KEY` is set |

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
eslint.config.mjs
.prettierrc
tsconfig.json
```

## Configuration

| Setting | Value |
|---------|-------|
| Base URL | `https://cloud.google.com` (`BASE_URL` env) |
| Calculator path | `/products/calculator?hl=en` |
| Browser | Chromium |
| Visual tolerance | `maxDiffPixels: 1500` |
| Trace / screenshot / video | On failure only |
| Retries | 1 in CI, 0 locally |

When a screenshot test fails, open `npm run test:report` to compare expected, actual, and diff images.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Node version | Run `nvm use` |
| Browser not found | Run `npx playwright install chromium` |
| Cookie banner | Handled in the calculator fixture |
| Snapshot mismatch | Run `npm run test:visual:update` locally |
| Report Portal | Set `RP_*` variables in `.env` |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
