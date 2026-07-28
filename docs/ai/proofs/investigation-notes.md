# AI investigation notes — Desmos calculator

Captured during Playwright MCP / browser exploration before implementing automated tests.

## Page structure (accessibility tree)

- Header actions: Save, Log In, Share Graph, Tools, Add Item
- **Expression List** region with numbered expression rows
- On-screen keypad for math input
- **Graph Settings Controls** region
- Single **canvas** for rendered graphs

## Selected test feature

**Quickly Create Graphs** — enter `y=x^2` and verify the parabola is plotted.

Rationale: core Desmos workflow, stable locators, and verifiable state through `window.Calc.getState()`.

## Locator strategy

| Element | Locator |
|---------|---------|
| Expression row | `getByRole('listitem', { name: 'Expression 1' })` |
| Expression list | `getByRole('region', { name: 'Expression List' })` |
| Graph canvas | `locator('canvas').first()` |
| Zoom In | `getByRole('button', { name: 'Zoom In' })` |
| Promo close | `getByRole('button', { name: 'Close Message' })` |

## Deterministic assertions

```javascript
window.Calc.getState().expressions.list[0].latex // "y=x^{2}"
window.Calc.getState().graph.viewport            // changes after Zoom In
```

## Sample exploration output

After entering `y=x^2`, expression 1 text included:

```text
"y" equals "x" squared Has graph.
```

Viewport before zoom: `{ xmin: -10, xmax: 10, ymin: -7.8, ymax: 7.8 }`  
Viewport after one Zoom In: `{ xmin: -5, xmax: 5, ymin: -3.9, ymax: 3.9 }`
