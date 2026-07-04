# ATM JS Intermediate — Test Automation Framework

Smoke tests for the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator).

Built with WebdriverIO, TypeScript, Mocha, and the Page Object Model.

## Prerequisites

- Node.js 14+ (see `.nvmrc`)
- npm
- Google Chrome

```bash
node -v
nvm use   # if you use nvm
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
| Browser  | Chrome via chromedriver                      |
| Reporter | `spec`                                     |

## Troubleshooting

| Problem           | Fix                              |
|-------------------|----------------------------------|
| Node version      | Run `nvm use`                    |
| Chrome mismatch   | Install a chromedriver version that matches your Chrome browser |
| Cookie banner     | Handled in the test `before` hook |

## Disclaimer

This is an educational project. Do not treat the current solution as production-ready.
