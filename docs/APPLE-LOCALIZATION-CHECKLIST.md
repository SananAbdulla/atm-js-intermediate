# Test Checklist — Apple Website Localization

Target application: [Apple](https://www.apple.com/)

Region is set with the `geo` cookie before navigation (preferred over UI locale pickers, geolocation, or timezone).

---

## User Story Scope

**Story:** As a global buyer, I want the Apple regional site to reflect shop availability, currency, and language for my country so I can understand what I can purchase locally.

**In scope:**

- Service availability messaging for restricted regions
- Store and shopping bag visibility in the global header
- Product card price/currency on shop-enabled regions
- Localized purchase CTA text
- One additional advanced localization scenario

**Out of scope:**

- Full checkout / payment flows
- Account sign-in
- Retail store locator booking
- Visual pixel comparisons

---

## Manual Investigation Steps

1. Set the `geo` cookie to a region code (`GB`, `SG`, `GE`, `BY`, `DE`, `UA`).
2. Open the regional home (`/uk/`, `/sg/`, `/ge/`, `/by/`, `/de/`, `/ua/`).
3. Confirm whether Store and Bag appear in the global nav.
4. Confirm whether the availability notice is present for restricted regions.
5. On shop regions, open `/shop/buy-iphone/iphone-16` and record title, price currency, and CTA text.

---

## User Scenarios

| ID | Scenario | Expected result | Automated |
|----|----------|-----------------|-----------|
| LOC-01 | Buyer from UK or Singapore opens regional home | No country unavailability notice; Store and Bag are visible | Yes — `apple-service-availability.spec.ts` |
| LOC-02 | Buyer from Georgia or Belarus opens regional home | Availability notice is shown; Store and Bag are hidden | Yes — `apple-service-availability.spec.ts` |
| LOC-03 | Buyer from UK / Singapore / Germany opens iPhone product page | Title, regional currency, and localized purchase CTA are shown | Yes — `apple-product-card.spec.ts` |
| LOC-04 | Advanced: Ukraine home uses localized notice without shop controls | Ukrainian availability notice; Store and Bag are hidden | Yes — `apple-advanced.spec.ts` |
| LOC-05 | Advanced: same product shows different currencies in UK vs Singapore | UK price uses `£`, Singapore price uses `S$` | Yes — `apple-advanced.spec.ts` |

---

## Acceptance Criteria Mapping

| Criterion | Coverage |
|-----------|----------|
| At least three regions with localization-sensitive content | UK, Singapore, Georgia, Belarus (+ Germany, Ukraine) |
| Currency / price differences | UK `£`, Singapore `S$`, Germany `€` |
| Language / translation | German CTA `Weiter`; Ukrainian availability notice |
| `geo` cookie for region setup | `setAppleGeoCookie()` in helpers |

---

## How To Run

```bash
npx playwright test --project=apple
```
