import { test, expect } from '../fixtures/desmos.fixture';

const graphScreenshotOptions = {
  animations: 'disabled' as const,
  maxDiffPixelRatio: 0.05,
  threshold: 0.2,
};

test.describe('Desmos visual graph comparisons', () => {
  test.describe.configure({ mode: 'serial' });

  test('template graph from Examples matches baseline screenshot', async ({ desmosPage }) => {
    await desmosPage.openExampleByName(/Lines: Slope Intercept Form/i);
    await expect(desmosPage.graphArea()).toBeVisible();
    await desmosPage.prepareGraphForScreenshot();

    await expect(desmosPage.graphArea()).toHaveScreenshot('desmos-template-slope-intercept.png', {
      ...graphScreenshotOptions,
      mask: desmosPage.screenshotMasks(),
    });
  });

  test('manual graph with settings matches baseline screenshot', async ({ desmosPage }) => {
    await desmosPage.enterExpression('y=x^2');
    await desmosPage.setAxisLabels('x', 'y');
    await desmosPage.enableReverseContrast();
    await expect(desmosPage.graphArea()).toBeVisible();
    await desmosPage.prepareGraphForScreenshot();

    await expect(desmosPage.graphArea()).toHaveScreenshot('desmos-manual-quadratic.png', {
      ...graphScreenshotOptions,
      mask: desmosPage.screenshotMasks(),
    });
  });

  test('zoom controls reveal Default Viewport and stay masked in comparison', async ({
    desmosPage,
  }) => {
    await desmosPage.enterExpression('y=2x+1');
    await desmosPage.zoomIn(2);
    await expect(desmosPage.homeButton()).toBeVisible();
    await desmosPage.resetViewport();
    await desmosPage.prepareGraphForScreenshot();

    await expect(desmosPage.graphArea()).toHaveScreenshot('desmos-line-after-zoom-home.png', {
      ...graphScreenshotOptions,
      mask: desmosPage.screenshotMasks(),
    });
  });

  test('manual recreate of the same equation matches shared graph baseline', async ({
    desmosPage,
  }) => {
    await desmosPage.enterExpression('y=x^2');
    await desmosPage.prepareGraphForScreenshot();
    await expect(desmosPage.graphArea()).toHaveScreenshot('desmos-shared-quadratic.png', {
      ...graphScreenshotOptions,
      mask: desmosPage.screenshotMasks(),
    });

    await desmosPage.openNewGraph();
    await desmosPage.enterExpression('y=x^2');
    await desmosPage.prepareGraphForScreenshot();
    await expect(desmosPage.graphArea()).toHaveScreenshot('desmos-shared-quadratic.png', {
      ...graphScreenshotOptions,
      mask: desmosPage.screenshotMasks(),
    });
  });
});
