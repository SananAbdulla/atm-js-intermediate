# ATM JS Intermediate — Test Automation Framework

Smoke tests for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator).

Built with WebdriverIO, TypeScript, Mocha, and the Page Object Model.

## Prerequisites

- Node.js 18+ (see `.nvmrc`)
- npm
- Google Chrome

```bash
node -v
nvm use
```

## Setup

```bash
npm install
```

Optional `.env` file to override the base URL:

```env
BASE_URL=https://cloud.google.com
```

## Running tests

```bash
npm test
```

## Project structure

```
src/
  pageObject/
    BasePage.ts
    calculator_page.ts
  tests/
    smoke/
      cloud-calculator.tests.ts

wdio.conf.js
tsconfig.json
```

## Configuration

| Setting  | Value                                      |
|----------|--------------------------------------------|
| Base URL | `https://cloud.google.com` (`BASE_URL` env) |
| Browser  | Chrome (driver managed by WebdriverIO)     |
| Reporter | `spec`                                     |

## Troubleshooting

| Problem       | Fix                    |
|---------------|------------------------|
| Node version  | Run `nvm use`          |
| Cookie banner | Handled in `beforeEach` |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
