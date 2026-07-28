import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DesmosPage extends BasePage {
  constructor(page: Page) {
    super(page, 'https://www.desmos.com/calculator');
  }

  openFileButton(): Locator {
    return this.page.getByRole('button', { name: /Open File/i });
  }

  examplesTab(): Locator {
    return this.page.getByRole('tab', { name: /^Examples$/i });
  }

  graphSettingsButton(): Locator {
    return this.page.getByRole('button', { name: /Graph Settings/i });
  }

  zoomInButton(): Locator {
    return this.page.getByRole('button', { name: /Zoom In/i });
  }

  zoomOutButton(): Locator {
    return this.page.getByRole('button', { name: /Zoom Out/i });
  }

  homeButton(): Locator {
    return this.page.getByRole('button', { name: /Default Viewport/i });
  }

  graphArea(): Locator {
    return this.page.locator('.dcg-grapher.dcg-grapher-2d .dcg-graph-outer').first();
  }

  expressionMathField(): Locator {
    return this.page.locator('.dcg-expressionitem .dcg-math-field').first();
  }

  async open(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.graphArea().waitFor({ state: 'visible' });
    await this.dismissTransientUi();
  }

  async dismissTransientUi(): Promise<void> {
    const closeMessage = this.page.getByRole('button', { name: /Close Message/i });
    if (await closeMessage.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await closeMessage.click().catch(() => undefined);
    }
  }

  async openExampleByName(name: RegExp): Promise<void> {
    await this.openFileButton().click();
    await expect(this.examplesTab()).toBeVisible();
    await this.examplesTab().click();
    await this.page.getByText(name).first().click();
    await this.page.waitForURL(/\/calculator\/[a-z0-9]+/i, { timeout: 30_000 });
    await this.graphArea().waitFor({ state: 'visible' });
    await this.dismissTransientUi();
    await this.page.waitForTimeout(1_500);
  }

  async openNewGraph(): Promise<void> {
    await this.openFileButton().click();
    await this.page.getByRole('link', { name: /^New Graph$/i }).click();
    await this.page.waitForURL('https://www.desmos.com/calculator');
    await this.graphArea().waitFor({ state: 'visible' });
    await this.dismissTransientUi();
  }

  async enterExpression(expression: string): Promise<void> {
    const field = this.expressionMathField();
    await field.click();
    await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await this.page.keyboard.type(expression, { delay: 30 });
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1_200);
  }

  async openGraphSettings(): Promise<void> {
    await this.graphSettingsButton().click();
    await expect(this.page.getByText('Reverse contrast', { exact: true })).toBeVisible();
  }

  async enableReverseContrast(): Promise<void> {
    await this.openGraphSettings();
    const label = this.page.locator('label').filter({ hasText: /^Reverse contrast$/i });
    const checkbox = label.locator('input[type="checkbox"]');
    if (!(await checkbox.isChecked().catch(() => false))) {
      await label.click();
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(400);
  }

  async setAxisLabels(xLabel: string, yLabel: string): Promise<void> {
    await this.openGraphSettings();
    const axisLabels = this.page.getByRole('dialog', { name: /Graph Settings/i }).getByRole('textbox', {
      name: /^Label$/i,
    });
    await expect(axisLabels).toHaveCount(2);
    await axisLabels.nth(0).fill(xLabel);
    await axisLabels.nth(1).fill(yLabel);
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(400);
  }

  async zoomIn(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.zoomInButton().click();
      await this.page.waitForTimeout(250);
    }
    await this.page.waitForTimeout(500);
  }

  async zoomOut(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.zoomOutButton().click();
      await this.page.waitForTimeout(250);
    }
    await this.page.waitForTimeout(500);
  }

  async resetViewport(): Promise<void> {
    if (await this.homeButton().isVisible().catch(() => false)) {
      await this.homeButton().click();
      await this.page.waitForTimeout(800);
    }
  }

  screenshotMasks(): Locator[] {
    return [this.zoomInButton(), this.zoomOutButton(), this.homeButton(), this.graphSettingsButton()];
  }

  async prepareGraphForScreenshot(options: { resetViewport?: boolean } = {}): Promise<void> {
    const { resetViewport = true } = options;
    await this.dismissTransientUi();
    if (resetViewport) {
      await this.resetViewport();
    }
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `,
    });
    await expect(this.graphArea()).toBeVisible();
    await this.page.waitForTimeout(600);
  }
}
