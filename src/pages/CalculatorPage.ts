import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/products/calculator');
  }

  cookieAcceptButton(): Locator {
    return this.page.getByRole('button', { name: /OK, got it|Aceptar/i });
  }

  async dismissCookieBanner(): Promise<void> {
    const dismissButton = this.page.getByRole('button', { name: 'Dismiss' });
    if (await dismissButton.isVisible({ timeout: 2_000 })) {
      await dismissButton.click();
      return;
    }

    const acceptButton = this.cookieAcceptButton();
    if (await acceptButton.isVisible({ timeout: 2_000 })) {
      await acceptButton.click();
    }
  }

  addEstimateButton(): Locator {
    return this.page
      .getByRole('heading', { name: 'Get started with your estimate' })
      .locator('xpath=ancestor::div[1]')
      .getByRole('button', { name: 'Add to estimate' });
  }

  addEstimationDialogHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Add to this estimate' });
  }

  computeEngineOption(): Locator {
    return this.page.getByRole('heading', { name: 'Compute Engine', exact: true });
  }

  viewDetailsButton(): Locator {
    return this.page.getByRole('button', { name: 'View details' });
  }

  configurationBlock(): Locator {
    return this.page.getByRole('heading', { name: /Instances configuration/i });
  }

  monthlyCost(): Locator {
    return this.page.locator('.egBpsb .D0aEmf');
  }

  instanceCountInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /Number of instances/ });
  }

  bootDiskSizeInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /Boot disk size/ });
  }

  seriesCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Series' });
  }

  machineTypeCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Machine type' });
  }

  operatingSystemCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Operating System / Software' });
  }

  regionCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Region' });
  }

  incrementInstancesButton(): Locator {
    return this.page
      .getByText('Number of instances*', { exact: true })
      .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]')
      .getByRole('button', { name: 'Increment' });
  }

  decrementInstancesButton(): Locator {
    return this.page
      .getByText('Number of instances*', { exact: true })
      .locator('xpath=ancestor::div[.//button[@aria-label="Decrement"]][1]')
      .getByRole('button', { name: 'Decrement' });
  }

  pageHeading(): Locator {
    return this.page.getByRole('heading', {
      name: /Welcome to Google Cloud.*pricing calculator/i,
    });
  }

  mobileMenuButton(): Locator {
    return this.page.getByRole('button', { name: 'menu' });
  }

  mobileNavigationPanel(): Locator {
    return this.page.getByRole('banner').getByRole('link', { name: 'Overview' });
  }

  async isMobileLayout(): Promise<boolean> {
    return this.mobileMenuButton().isVisible({ timeout: 2_000 }).catch(() => false);
  }

  async openMobileMenu(): Promise<void> {
    if (await this.isMobileLayout()) {
      await this.mobileMenuButton().click();
      await this.mobileNavigationPanel().waitFor({ state: 'visible' });
    }
  }

  async prepareMobileView(): Promise<void> {
    await this.pageHeading().waitFor({ state: 'visible' });
  }

  addEstimationModalWindow(): Locator {
    return this.addEstimationDialogHeading();
  }

  header(): Locator {
    return this.page.locator('header');
  }

  footer(): Locator {
    return this.page.locator('footer');
  }

  languageSelector(): Locator {
    return this.footer().locator('.VfPpkd-O1htCb');
  }

  async dismissPricingChatWidget(): Promise<void> {
    const chatMessage = this.page.getByText('Have questions about our pricing');
    if (await chatMessage.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await this.page.keyboard.press('Escape');
      const closeChat = this.page.getByRole('button', { name: /close|dismiss/i }).first();
      if (await closeChat.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await closeChat.click({ force: true }).catch(() => undefined);
      }
    }
  }

  private async scrollIntoViewSafe(locator: Locator): Promise<void> {
    await locator.evaluate((el: Element) => {
      el.scrollIntoView({ block: 'center', inline: 'nearest' });

      let parent = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const canScroll =
          /(auto|scroll)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight;
        if (canScroll) {
          const elRect = el.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();
          parent.scrollTop += elRect.top - parentRect.top - parent.clientHeight / 2 + elRect.height / 2;
        }
        parent = parent.parentElement;
      }

      // Keep controls clear of sticky estimate chrome at the bottom of mobile/tablet viewports.
      const rect = el.getBoundingClientRect();
      const overflow = rect.bottom - (window.innerHeight - 140);
      if (overflow > 0) {
        window.scrollBy(0, overflow);
      }
    });

    await expect(locator).toBeVisible();
  }

  /**
   * Click without Playwright actionability scrolling.
   * WebKit iPhone/iPad hangs on scrollIntoViewIfNeeded for covered calculator controls.
   */
  private async dispatchPointerClick(locator: Locator): Promise<void> {
    await this.scrollIntoViewSafe(locator);
    await locator.evaluate((el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top + Math.min(rect.height / 2, 18);
      const opts: MouseEventInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX,
        clientY,
        button: 0,
        buttons: 1,
      };

      el.focus();
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'] as const) {
        el.dispatchEvent(new MouseEvent(type, opts));
      }
    });
  }

  private async openControl(locator: Locator): Promise<void> {
    await this.dispatchPointerClick(locator);
  }

  async selectLanguage(localeCode: string): Promise<void> {
    await this.dismissPricingChatWidget();
    await this.scrollIntoViewSafe(this.footer());
    await this.dispatchPointerClick(this.languageSelector());

    const listbox = this.page.getByRole('listbox', { name: 'Language Selector Menu' });
    await listbox.waitFor({ state: 'visible' });
    await this.dispatchPointerClick(listbox.locator(`[role="option"][data-value="${localeCode}"]`));
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openAddEstimateDialog(): Promise<void> {
    await expect(async () => {
      await this.dispatchPointerClick(this.addEstimateButton());
      await expect(this.addEstimationDialogHeading()).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async selectComputeEngine(): Promise<void> {
    await this.dispatchPointerClick(this.computeEngineOption());
  }

  async closeAddEstimateDialog(): Promise<void> {
    await this.page.keyboard.press('Escape');

    try {
      await this.addEstimationDialogHeading().waitFor({ state: 'hidden', timeout: 3_000 });
      return;
    } catch {
      // Touch profiles may ignore Escape; fall back to an explicit close control.
    }

    const closeButton = this.page.locator('[role="dialog"] button[aria-label="Close"]').first();
    if (await closeButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.dispatchPointerClick(closeButton);
    }

    await this.addEstimationDialogHeading().waitFor({ state: 'hidden' });
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.dismissPricingChatWidget();
    await this.openAddEstimateDialog();
    await this.selectComputeEngine();

    const viewDetails = this.viewDetailsButton();
    if (await viewDetails.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.dispatchPointerClick(viewDetails);
    }

    await this.configurationBlock().waitFor({ state: 'visible' });
    await this.waitForStableMonthlyCost();
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = this.incrementInstancesButton();

    for (let i = 0; i < count; i++) {
      await this.dispatchPointerClick(incrementButton);
    }
  }

  async removeInstances(count: number): Promise<void> {
    const decrementButton = this.decrementInstancesButton();

    for (let i = 0; i < count; i++) {
      await this.dispatchPointerClick(decrementButton);
    }
  }

  async getMonthlyCostText(): Promise<string> {
    const text = await this.monthlyCost().textContent();
    return text?.trim() ?? '';
  }

  parseMonthlyCost(costText: string): number {
    const match = costText.match(/\$([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(',', '')) : NaN;
  }

  private async openComboboxAndSelect(combobox: Locator, option: Locator): Promise<void> {
    const visibleOption = option.filter({ visible: true }).first();

    await this.dismissPricingChatWidget();

    await expect(async () => {
      await this.dispatchPointerClick(combobox);
      if (!(await visibleOption.isVisible().catch(() => false))) {
        await combobox.evaluate((el: HTMLElement) => el.focus());
        await this.page.keyboard.press('ArrowDown');
      }
      if (!(await visibleOption.isVisible().catch(() => false))) {
        await combobox.evaluate((el: HTMLElement) => el.click());
      }
      await expect(visibleOption).toBeVisible({ timeout: 2_500 });
    }).toPass({ timeout: 45_000 });

    await this.dispatchPointerClick(visibleOption);
    await expect(this.page.getByRole('listbox').filter({ visible: true }))
      .toHaveCount(0, { timeout: 5_000 })
      .catch(() => undefined);
  }

  async selectSeries(series: string): Promise<void> {
    const seriesPattern = new RegExp(series, 'i');

    await expect(async () => {
      await this.openComboboxAndSelect(
        this.seriesCombobox(),
        this.page.locator(`[role="option"][data-value="${series.toLowerCase()}"]`),
      );
      await expect(this.seriesCombobox()).toContainText(seriesPattern, { timeout: 3_000 });
    }).toPass({ timeout: 60_000 });

    await this.machineTypeCombobox().waitFor({ state: 'visible' });
  }

  async selectMachineType(machineType: string): Promise<void> {
    await expect(async () => {
      await this.openComboboxAndSelect(
        this.machineTypeCombobox(),
        this.page.locator(`[role="option"][data-value="${machineType}"]`),
      );
      await expect(this.machineTypeCombobox()).toContainText(machineType, { timeout: 3_000 });
    }).toPass({ timeout: 60_000 });
  }

  async selectOperatingSystem(operatingSystem: RegExp | string): Promise<void> {
    const option =
      typeof operatingSystem === 'string'
        ? this.page.getByRole('option', { name: operatingSystem })
        : this.page.getByRole('option').filter({ hasText: operatingSystem });
    await this.openComboboxAndSelect(this.operatingSystemCombobox(), option);
  }

  async selectRegion(region: RegExp | string): Promise<void> {
    const option =
      typeof region === 'string'
        ? this.page.getByRole('option', { name: region })
        : this.page.getByRole('option').filter({ hasText: region });
    await this.openComboboxAndSelect(this.regionCombobox(), option);
  }

  async setBootDiskSize(gib: number): Promise<void> {
    const diskInput = this.bootDiskSizeInput();
    await diskInput.fill(String(gib));
    await diskInput.press('Tab');
  }

  async setInstanceCount(count: number): Promise<void> {
    const instanceInput = this.instanceCountInput();
    await instanceInput.fill(String(count));
    await instanceInput.press('Tab');
  }

  async configureStandardComputeEngine(options: {
    series: string;
    machineType: string;
    operatingSystem: RegExp | string;
    region: RegExp | string;
    bootDiskSizeGiB: number;
    instanceCount: number;
  }): Promise<void> {
    const costBefore = await this.getMonthlyCostText();

    await this.selectSeries(options.series);
    await this.selectMachineType(options.machineType);
    await this.selectOperatingSystem(options.operatingSystem);
    await this.selectRegion(options.region);
    await this.setBootDiskSize(options.bootDiskSizeGiB);
    await this.setInstanceCount(options.instanceCount);

    await this.waitForMonthlyCostChange(costBefore);
  }

  async waitForMonthlyCostChange(previousCost: string): Promise<void> {
    await expect
      .poll(async () => this.getMonthlyCostText(), { timeout: 60_000 })
      .not.toBe(previousCost);
    await this.waitForStableMonthlyCost();
  }

  async waitForStableMonthlyCost(options?: { allowPlaceholder?: boolean }): Promise<void> {
    const allowPlaceholder = options?.allowPlaceholder ?? false;
    let previousCost = '';
    let stableReads = 0;

    for (let attempt = 0; attempt < 50; attempt++) {
      const currentCost = await this.getMonthlyCostText();
      const isDollarAmount = /\$\d+\.\d{2}/.test(currentCost);
      const isPlaceholder = currentCost === '--';
      const isRecognizedCost = isDollarAmount || (allowPlaceholder && isPlaceholder);

      if (isRecognizedCost && currentCost === previousCost) {
        stableReads += 1;
        if (stableReads >= 3) {
          return;
        }
      } else {
        stableReads = 0;
      }

      previousCost = currentCost;
      await this.page.waitForTimeout(500);
    }

    throw new Error(`Monthly cost did not stabilize. Last value: ${previousCost}`);
  }
}
