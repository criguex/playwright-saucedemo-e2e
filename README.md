[Leer en español](README.es.md)

<p align="center">
  <img src="docs/assets/banner.svg" alt="playwright-saucedemo-e2e: end-to-end regression suite for SauceDemo, built on the Page Object Model and run on Chromium, Firefox and WebKit" width="100%">
</p>

# Playwright SauceDemo E2E

End-to-end regression suite for [SauceDemo](https://www.saucedemo.com) built with Playwright and TypeScript, structured around the Page Object Model and executed cross-browser on every push.

[![Playwright Tests](https://github.com/criguex/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/criguex/playwright-saucedemo-e2e/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.63-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)

## How it works

<p align="center">
  <img src="docs/assets/how-it-works.svg" alt="Specs call Page Objects, the Playwright runner sends them to saucedemo.com on Chromium, Firefox and WebKit, and the results land in the list and HTML reports; GitHub Actions runs the same suite on every push" width="100%">
</p>

1. A spec (`login`, `inventory` or `checkout`) describes the user flow in intent-level calls.
2. The Page Objects own every locator and turn those calls into clicks, fills and assertions.
3. `playwright.config.ts` runs each spec once per browser project (Chromium, Firefox, WebKit) against `https://www.saucedemo.com`.
4. The terminal gets the `list` reporter; the HTML report keeps the screenshot and video of any failed test, plus the trace on the first retry.

<p align="center">
  <img src="docs/assets/how-it-works.gif" alt="Animation: the flow lights up step by step while the real CI log of run 36095558718 is replayed, ending in 33 passed (38.7s)" width="960">
</p>

The animation replays the real log of CI run [36095558718](https://github.com/criguex/playwright-saucedemo-e2e/actions/runs/36095558718) (also as [MP4](docs/assets/how-it-works.mp4)).

## What it tests

| Spec | Scenarios |
|---|---|
| `tests/login.spec.ts` | Successful login with `standard_user`; locked-out user is rejected; invalid credentials show the expected error message |
| `tests/inventory.spec.ts` | Catalogue lists 6 products; sorting by name (A-Z, Z-A) and by price (low-high, high-low); adding a product updates the cart badge |
| `tests/checkout.spec.ts` | Full purchase flow (add two items, review the cart, shipping information, order summary, confirmation); removing an item from the cart before checkout |

11 tests, run on Chromium, Firefox and WebKit.

**Latest CI result on `main`** (run 36095558718, 2026-09-25): `Running 33 tests using 1 worker` → `33 passed (38.7s)`.

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
├── docs/
│   ├── assets/        banner.svg, how-it-works.svg, how-it-works.gif, how-it-works.mp4
│   └── scenes/        how-it-works.html + export.sh (rebuild the animation)
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

## Limits

- The suite runs against the live public demo at `saucedemo.com`, so an outage of that site fails the run.
- It covers UI flows only: there are no API, accessibility or visual-regression checks.

## Rebuilding the animation

`docs/scenes/how-it-works.html` draws each frame from `?t=<seconds>`; `docs/scenes/export.sh` captures the frames with headless Chrome and encodes `how-it-works.gif` and `how-it-works.mp4` with ffmpeg.

---

Cristian Guerra · Senior SDET · [linkedin.com/in/criguex](https://www.linkedin.com/in/criguex)
