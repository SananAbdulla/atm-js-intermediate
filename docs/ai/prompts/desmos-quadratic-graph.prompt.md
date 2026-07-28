# Desmos quadratic graph scenario

Use this natural-language prompt with an AI assistant (Gemini Code Assist, Copilot, or Playwright MCP) to design and generate a Playwright test for Desmos.

## Prompt

```text
Investigate https://www.desmos.com/calculator as a manual tester.

Design one end-to-end Playwright scenario for the "Quickly Create Graphs" feature:
1. Open the Desmos graphing calculator.
2. Dismiss the promotional message if it appears.
3. Focus the first expression row in the Expression List.
4. Enter the equation y=x^2.
5. Verify the expression is stored as LaTeX y=x^{2}.
6. Verify the expression row reports that a graph was generated.
7. Verify the graph canvas is visible.
8. Click Zoom In once and verify the graph viewport bounds shrink.

Use the Page Object Model, role-based locators from the accessibility tree,
and window.Calc.getState() for deterministic assertions where possible.
Generate TypeScript using @playwright/test and a dedicated fixture.
```

## Expected AI output

- Page object methods for expression entry, graph canvas, zoom, and Calc state reads
- Fixture that opens Desmos and dismisses the promo banner
- Executable spec under `tests/ai/desmos-graph-equation.spec.ts`

## BDD-style scenario (optional communication format)

```gherkin
Feature: Plot custom equations
  As a math student
  I want to enter an equation in Desmos
  So that I can visualize the graph instantly

  Scenario: Plot a quadratic function
    Given the Desmos graphing calculator is open
    When I enter "y=x^2" in expression 1
    Then the stored LaTeX should be "y=x^{2}"
    And expression 1 should indicate a graph was created
    And the graph canvas should be visible
    When I zoom in on the graph
    Then the viewport bounds should decrease
```
