# Test Checklist — Desmos Visual Graph Comparisons

Target application: [Desmos Graphing Calculator](https://www.desmos.com/calculator)

---

## User Story Scope

**Story:** As a math student/educator/researcher, I want reliable visual graph representations from templates and manual entry so I can trust what learners see on screen.

**In scope:**

- Opening graphs from Examples/Templates
- Manual equation entry and graph settings (contrast, axis labels)
- Zoom controls and Default Viewport (Home) visibility
- Screenshot comparisons of the final graph area
- Masking zoom / home / settings controls during comparison

**Out of scope:**

- Account login / saved work sync
- Audio trace and accessibility tooling beyond basic UI
- 3D calculator

---

## Scenarios

| ID | Scenario | Creation path | Automated |
|----|----------|---------------|-----------|
| DES-01 | Open graph from Examples | Template | Yes — `desmos-visual.spec.ts` |
| DES-02 | Manual graph with axis labels and reverse contrast | Manual | Yes — `desmos-visual.spec.ts` |
| DES-03 | Zoom in reveals Default Viewport; then Home restores stable graph for masked shot | Manual | Yes — `desmos-visual.spec.ts` |
| DES-04 | Same equation created twice produces matching graphs | Manual recreate | Yes — `desmos-visual.spec.ts` |
| DES-05 | Collapse/expand expressions in sidebar | Manual | Not automated (optional beyond AC minimum) |

---

## Acceptance Criteria Mapping

| Criterion | Coverage |
|-----------|----------|
| At least two scenarios | DES-01 … DES-04 |
| E2E final graph screenshot comparison | `toHaveScreenshot` on `.dcg-grapher` |
| Manual and template variants | DES-01 template, DES-02/04 manual |
| NPM scripts for snapshots | `test:desmos`, `test:desmos:update` |
| Mask/hide elements | Zoom In/Out, Default Viewport, Graph Settings |
| Cross-browser optional | `desmos-chromium` and `desmos-firefox` projects |

---

## How To Run

```bash
npm run test:desmos
npm run test:desmos:update
```
