import { test, expect } from '../fixtures/desmos.fixture';

/**
 * Scenario designed with AI assistance from:
 * docs/ai/prompts/desmos-quadratic-graph.prompt.md
 */
test.describe('Desmos graphing calculator', () => {
  test('should plot a quadratic equation entered in the expression list', async ({
    desmosPage,
  }) => {
    await desmosPage.enterExpression('y=x^2');

    await desmosPage.waitForExpressionLatex('y=x^{2}');
    await expect(desmosPage.expressionItem(1)).toContainText(/Has graph/i);
    await expect(desmosPage.graphCanvas()).toBeVisible();

    const latex = await desmosPage.getExpressionLatex();
    expect(latex).toBe('y=x^{2}');
  });

  test('should zoom the graph after an equation is plotted', async ({ desmosPage }) => {
    await desmosPage.enterExpression('y=x^2');
    await desmosPage.waitForExpressionLatex('y=x^{2}');

    const viewportBefore = await desmosPage.getGraphViewport();
    expect(viewportBefore).not.toBeNull();

    await desmosPage.zoomIn();
    await desmosPage.waitForZoomedViewport(viewportBefore!);

    await expect(desmosPage.graphCanvas()).toBeVisible();
  });
});
