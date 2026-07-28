# ATM JS Intermediate — Test Automation Framework

Smoke tests for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator).

AI-assisted tests for the [Desmos graphing calculator](https://www.desmos.com/calculator).

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
DESMOS_BASE_URL=https://www.desmos.com
RP_API_KEY=your_report_portal_token
RP_ENDPOINT=https://reportportal.epam.com/api/v1
RP_PROJECT=your_personal_project
RP_LAUNCH=ATM Playwright Tests
```

## Running tests

```bash
npm test
npm run test:ai
npm run test:headed
npm run test:ui
npm run test:report
```

Run a single suite:

```bash
npx playwright test tests/smoke
npx playwright test tests/ai
```

## AI-powered testing (Desmos)

Natural-language prompts and workflow notes live under `docs/ai/`.

| Command | Scope |
|---------|-------|
| `npm run test:ai` | Desmos AI-designed scenarios |
| `npm test` | Full suite (Google Cloud smoke + Desmos) |

See `docs/ai/WORKFLOW.md` for investigation notes, prompts, and proof artifacts.

## Linting and formatting

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

ESLint uses `@typescript-eslint` for source files and `eslint-plugin-playwright` for tests under `tests/`. Prettier runs through `eslint-plugin-prettier`.

## Reporting

| Reporter | Output | Purpose |
|----------|--------|---------|
| `line` | Console | Essential pass/fail output |
| `html` | `playwright-report/` | HTML report with failure artifacts |
| `junit` | `test-results/junit-report.xml` | CI statistics |
| Report Portal | Remote project | Enabled when `RP_API_KEY` is set |

Failed tests retain trace, screenshot, and video. Report artifacts are gitignored.

## Project structure

```
src/pages/
  BasePage.ts
  CalculatorPage.ts
  DesmosCalculatorPage.ts

tests/
  fixtures/
    calculator.fixture.ts
    desmos.fixture.ts
  smoke/
    cloud-calculator.spec.ts
  ai/
    desmos-graph-equation.spec.ts

docs/ai/
  WORKFLOW.md
  prompts/
  proofs/

playwright.config.ts
eslint.config.mjs
.prettierrc
tsconfig.json
```

## Configuration

| Setting | Value |
|---------|-------|
| Base URL | `https://cloud.google.com` (`BASE_URL` env) |
| Browser | Chromium |
| Parallelism | Enabled (`fullyParallel`) |
| Trace / screenshot / video | On failure only |
| Retries | 1 in CI, 0 locally |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Node version | Run `nvm use` |
| Browser not found | Run `npx playwright install chromium` |
| Cookie banner | Handled in the calculator fixture |
| Report Portal | Set `RP_*` variables in `.env` |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
