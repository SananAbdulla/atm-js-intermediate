import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

declare global {
  interface Window {
    Calc?: {
      getState: () => {
        expressions?: { list?: Array<{ latex?: string }> };
        graph?: {
          viewport?: {
            xmin: number;
            ymin: number;
            xmax: number;
            ymax: number;
          };
        };
      };
    };
  }
}

export class DesmosCalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/calculator');
  }

  async openCalculator(baseURL = 'https://www.desmos.com'): Promise<void> {
    await this.page.goto(`${baseURL}${this.path}`);
  }

  promoCloseButton(): Locator {
    return this.page.getByRole('button', { name: 'Close Message' });
  }

  async dismissPromoMessage(): Promise<void> {
    const closeButton = this.promoCloseButton();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  expressionList(): Locator {
    return this.page.getByRole('region', { name: 'Expression List' });
  }

  expressionItem(index: number): Locator {
    return this.page.getByRole('listitem', { name: `Expression ${index}` });
  }

  graphCanvas(): Locator {
    return this.page.locator('canvas').first();
  }

  zoomInButton(): Locator {
    return this.page.getByRole('button', { name: 'Zoom In' });
  }

  graphSettingsButton(): Locator {
    return this.page.getByRole('button', { name: 'Graph Settings' });
  }

  async focusExpression(index: number): Promise<void> {
    await this.expressionItem(index).click();
  }

  async enterExpression(expression: string, index = 1): Promise<void> {
    await this.focusExpression(index);
    await this.page.keyboard.type(expression);
  }

  async getExpressionLatex(index = 0): Promise<string> {
    return this.page.evaluate((expressionIndex) => {
      const state = window.Calc?.getState();
      return state?.expressions?.list?.[expressionIndex]?.latex ?? '';
    }, index);
  }

  async waitForExpressionLatex(expected: string, index = 0): Promise<void> {
    await this.page.waitForFunction(
      ({ expressionIndex, latex }) => {
        const current = window.Calc?.getState()?.expressions?.list?.[expressionIndex]?.latex ?? '';
        return current === latex;
      },
      { expressionIndex: index, latex: expected },
    );
  }

  async getGraphViewport(): Promise<{
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  } | null> {
    return this.page.evaluate(() => {
      const viewport = window.Calc?.getState()?.graph?.viewport;
      return viewport ? { ...viewport } : null;
    });
  }

  async waitForZoomedViewport(previous: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }): Promise<void> {
    await this.page.waitForFunction((before) => {
      const current = window.Calc?.getState()?.graph?.viewport;
      if (!before || !current) {
        return false;
      }

      return current.ymax < before.ymax || current.xmax < before.xmax;
    }, previous);
  }

  async zoomIn(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.zoomInButton().click();
    }
  }
}
