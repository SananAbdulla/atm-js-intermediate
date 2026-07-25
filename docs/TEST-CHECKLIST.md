# Test Checklist — GCP Pricing Calculator (Compute Engine)

Target application: [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

---

## User Story Scope

**Story:** As a user, I want to estimate the monthly cost of a specific GCP service so I can plan my cloud budget.

**In scope for this iteration:**

- Compute Engine cost estimation on the pricing calculator
- Configuring machine type, instance count, boot disk size, operating system, and region
- Displaying the estimated monthly cost in USD
- Comparing cost impact when machine type changes within the same configuration

**Out of scope for this iteration:**

- Other GCP products (Cloud Storage, BigQuery, GKE, and so on)
- Billing account sign-in and negotiated pricing
- Currency conversion
- Exporting or sharing estimates
- FedRAMP compliance toggle
- GPU, local SSD, and advanced provisioning options

---

## User Scenarios (from instructions)

These scenarios are automated in `tests/e2e/`:

| ID | Scenario | Expected result | Automated |
|----|----------|-----------------|-----------|
| US-01 | Estimate Compute Engine with n1-standard-1, 2 instances, 100 GiB disk, Ubuntu Pro, Frankfurt (europe-west3) | Monthly cost equals `$116.12` | Yes — `tests/e2e/compute-engine-scenarios.spec.ts` |
| US-02 | Change machine type from n1-standard-1 to n1-standard-2 with the same configuration | Monthly cost updates to `$207.73` | Yes — `tests/e2e/compute-engine-scenarios.spec.ts` |

---

## Test Cases To Be Automated

| ID | Type | Scenario | Automated test |
|----|------|----------|----------------|
| INT-P-01 | Positive | Close add estimate dialog without selecting a product | `tests/integration/positive.spec.ts` |
| INT-P-02 | Positive | Add Compute Engine and display valid configuration | `tests/integration/positive.spec.ts` |
| INT-N-01 | Negative | Set instance count to `0` | `tests/integration/negative.spec.ts` |
| INT-N-02 | Negative | Set boot disk size to `-1` GiB | `tests/integration/negative.spec.ts` |
| INT-E-01 | Edge | Boot disk minimum boundary (`10` GiB) | `tests/integration/edge.spec.ts` |
| INT-E-02 | Edge | Boot disk upper boundary of agreed range (`100` GiB) | `tests/integration/edge.spec.ts` |

Smoke coverage remains in `tests/smoke/cloud-calculator.spec.ts` for calculator availability and instance increment/decrement behavior.

---

## Test Cases Not To Be Automated

| ID | Type | Scenario | Reason |
|----|------|----------|--------|
| MAN-01 | Positive | Verify pricing breakdown details in the cost panel | Requires manual visual validation of detailed line items |
| MAN-02 | Positive | Compare estimate with signed-in billing account pricing | Requires authenticated Google account |
| MAN-03 | Negative | Attempt to estimate unsupported legacy machine families | Requires manual exploration outside agreed scope |
| MAN-04 | Edge | Validate calculator behavior in non-Chromium browsers | Out of current Playwright project scope |
| MAN-05 | Edge | Validate cookie banner text and legal copy | Legal copy is not functional logic for this story |

---

## Positive Scenarios (Equivalence Partitioning)

Valid input combinations that represent normal successful usage.

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| INT-P-01 | Close dialog without adding product | 1. Open calculator<br>2. Click **Add to estimate**<br>3. Press Escape | Dialog closes and no Compute Engine configuration appears |
| INT-P-02 | Add Compute Engine estimate | 1. Open calculator<br>2. Add Compute Engine to estimate | Configuration section is visible and monthly cost is displayed |

---

## Negative Scenarios

Invalid input values that prevent cost calculation.

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| INT-N-01 | Zero instance count | 1. Configure a valid Compute Engine estimate<br>2. Set instance count to `0` | Monthly cost is not calculated and shows `--` |
| INT-N-02 | Negative boot disk size | 1. Configure a valid Compute Engine estimate<br>2. Set boot disk size to `-1` GiB | Monthly cost is not calculated and shows `--` |

---

## Edge Scenarios (Boundary Value Analysis)

Tests at agreed numeric boundaries for boot disk size.

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| INT-E-01 | Minimum boot disk boundary | 1. Configure Compute Engine with `100` GiB boot disk<br>2. Change boot disk to `10` GiB | Cost at `10` GiB is lower than cost at `100` GiB |
| INT-E-02 | Upper boot disk boundary | 1. Configure Compute Engine with `10` GiB boot disk<br>2. Change boot disk to `100` GiB | Cost at `100` GiB is higher than cost at `10` GiB |

---

## Expected Cost Reference

Captured from the pricing calculator on 25 Jul 2026 with USD selected:

| Configuration | Expected monthly cost |
|---------------|----------------------|
| n1-standard-1, 2 instances, 100 GiB, Ubuntu Pro, Frankfurt | `$116.12` |
| n1-standard-2, same configuration | `$207.73` |

---

## Folder Structure

| Folder | Content |
|--------|---------|
| `tests/e2e/` | User scenarios from instructions (US-01, US-02) |
| `tests/integration/` | Positive, negative, and edge automated cases |
| `tests/smoke/` | Basic calculator availability checks |
