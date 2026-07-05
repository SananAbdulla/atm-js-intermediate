# Test Checklist — GCP Pricing Calculator (Compute Engine)

Manual test cases for user story: **Estimate Monthly Cost of Specific GCP Service**.

Target: [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

---

## Positive scenarios

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| P-01 | Estimate Compute Engine monthly cost | 1. Open calculator<br>2. Add Compute Engine to estimate<br>3. Select N1 series, n1-standard-1<br>4. Set 2 instances<br>5. Set boot disk to 100 GiB<br>6. Select Ubuntu Pro OS<br>7. Select Frankfurt (europe-west3) region | Monthly cost is displayed as a dollar amount greater than $0 |
| P-02 | Compare machine type pricing | 1. Complete P-01 configuration<br>2. Note the monthly cost<br>3. Change machine type to n1-standard-2 | Monthly cost updates and is higher than n1-standard-1 cost |
| P-03 | Add estimate dialog | 1. Click **Add to estimate**<br>2. Select Compute Engine | Instances configuration section appears with a visible monthly cost |

---

## Negative scenarios

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| N-01 | Cancel add estimate dialog | 1. Click **Add to estimate**<br>2. Press Escape or close the dialog | Dialog closes; no Compute Engine configuration is added |
| N-02 | Dismiss without selecting product | 1. Click **Add to estimate**<br>2. Close dialog without choosing a product | Calculator remains on the welcome page with no new line items |

---

## Edge cases

| ID | Scenario | Steps | Expected result |
|----|----------|-------|-----------------|
| E-01 | Single vs multiple instances | 1. Configure n1-standard-1 with Ubuntu Pro in Frankfurt<br>2. Set 1 instance and note cost<br>3. Increase to 3 instances | Cost increases when instance count rises |
| E-02 | Boot disk size impact | 1. Configure standard CE setup<br>2. Set boot disk to 10 GiB and note cost<br>3. Increase boot disk to 500 GiB | Cost increases with larger boot disk |
| E-03 | Cookie banner handling | 1. Open calculator in a fresh session | Cookie banner can be dismissed; calculator remains usable |

---

## Automated coverage

The following Playwright E2E tests in `tests/e2e/compute-engine-cost.spec.ts` automate the scenarios above:

| Manual ID | Automated test |
|-----------|----------------|
| P-01 | `should estimate monthly cost for n1-standard-1 with Ubuntu Pro in Frankfurt` |
| P-02 | `should show higher cost for n1-standard-2 than n1-standard-1` |
| E-01 | `should increase cost when instance count is raised` |
| E-02 | `should increase cost when boot disk size is enlarged` |
| N-01 | `should not add estimate when add dialog is cancelled` |

Smoke tests in `tests/smoke/cloud-calculator.spec.ts` cover P-03 and additional dialog interactions.
