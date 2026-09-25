# Playwright SauceDemo E2E

End-to-end regression suite for [SauceDemo](https://www.saucedemo.com) built with Playwright and TypeScript, structured around the Page Object Model and executed cross-browser on every push.

[![Playwright Tests](https://github.com/criguex/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/criguex/playwright-saucedemo-e2e/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.63-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)

## What it tests

| Spec | Scenarios |
|---|---|
| `tests/login.spec.ts` | Successful login with `standard_user`; locked-out user is rejected; invalid credentials show the expected error message |
| `tests/inventory.spec.ts` | Catalogue lists 6 products; sorting by name (A-Z, Z-A) and by price (low-high, high-low); adding a product updates the cart badge |
| `tests/checkout.spec.ts` | Full purchase flow (add two items, review the cart, shipping information, order summary, confirmation); removing an item from the cart before checkout |

11 tests, run on Chromium, Firefox and WebKit.

## Architecture

- **Page Object Model**: one class per page (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`) owns its locators and exposes intent-level actions and assertions. Specs never reference selectors directly.
- **Locators**: role-based (`getByRole`) and `data-test` attributes; no XPath.
- **Configuration** (`playwright.config.ts`): `baseURL`, three browser projects, fully parallel execution, retries and a single worker on CI, trace on first retry, screenshots and videos kept only for failures.

## How to run

Requires Node.js 18 or newer.

```bash
git clone https://github.com/criguex/playwright-saucedemo-e2e.git
cd playwright-saucedemo-e2e
npm ci
npx playwright install --with-deps

npm test                                  # all browsers, headless
npm run test:chromium                     # single browser
npx playwright test tests/checkout.spec.ts
npm run test:headed
npm run test:ui
npm run report                            # open the last HTML report
```

## Project structure

```
.
├── .github/workflows/playwright.yml
├── tests/
│   ├── pageobjects/
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   └── checkout.spec.ts
├── playwright.config.ts
└── package.json
```

## Reporting

- `list` reporter in the terminal plus an HTML report in `playwright-report/` (`npm run report`).
- On CI the HTML report is uploaded as a build artifact (30-day retention) with the traces, screenshots and videos of any failed test.

## CI

GitHub Actions (`.github/workflows/playwright.yml`) runs the whole suite on Ubuntu for every push and pull request to `main`.

---

Cristian Guerra · Senior SDET · [linkedin.com/in/criguex](https://www.linkedin.com/in/criguex)
