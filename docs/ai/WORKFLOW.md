# AI-Powered Testing Workflow — Desmos Calculator

This task demonstrates how AI tools accelerate test design and implementation for the [Desmos graphing calculator](https://www.desmos.com/calculator).

## Tools used

| Tool | Role in this task |
|------|-------------------|
| **Playwright MCP (browser exploration)** | Manual-tester-style investigation of the Expression List, keypad, and graph canvas via the accessibility tree |
| **Natural-language prompt** | Scenario design in plain English (`docs/ai/prompts/desmos-quadratic-graph.prompt.md`) |
| **AI pair programming** | Generated/refined the page object, fixture, and executable Playwright spec |
| **Desmos Calc API (`window.Calc`)** | Deterministic assertions on LaTeX and viewport state after AI-guided exploration |

## Investigation findings (AI-assisted discovery)

During MCP/browser exploration we identified:

- **Expression List** — `region[name="Expression List"]` with `listitem[name="Expression 1"]`
- **Equation entry** — click the expression row, then type with the keyboard (contenteditable math field)
- **Graph confirmation** — expression row text includes `Has graph` after a valid equation
- **Canvas** — single visible `canvas` element renders the plot
- **Zoom** — `button[name="Zoom In"]` updates `window.Calc.getState().graph.viewport`
- **Promo banner** — optional `button[name="Close Message"]` on first visit

## Implemented scenario

**Feature:** Quickly create graphs from custom equations

**Tests:** `tests/ai/desmos-graph-equation.spec.ts`

1. Enter `y=x^2` in expression 1
2. Assert LaTeX via `window.Calc.getState()`
3. Assert `Has graph` in the expression row
4. Assert graph canvas visibility
5. Zoom in and assert viewport bounds shrink

## Framework vs AI manual execution

| Mode | Deterministic | Location |
|------|---------------|----------|
| **Framework-driven** | Yes — CI-safe Playwright tests | `tests/ai/desmos-graph-equation.spec.ts` |
| **AI manual tester** | No — exploratory MCP/browser session | Documented above; non-deterministic by nature |

## How to run

```bash
npm install
npx playwright install chromium
npm run test:ai
```

Run the full suite (Google Cloud smoke + Desmos AI tests):

```bash
npm test
```

## Proof artifacts

See `docs/ai/proofs/` for test run logs, investigation notes, and screenshots captured during task completion.

- `test-run.log` — full `npm test` output (8/8 passed)
- `investigation-notes.md` — MCP exploration findings
- `desmos-quadratic-graph.png` — graph of `y=x^2` after automated entry
