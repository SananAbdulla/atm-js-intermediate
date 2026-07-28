import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  constructor(page: Page) {
    super(page, '/products/calculator?hl=en');
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

  getStartedSection(): Locator {
    return this.page
      .getByRole('heading', { name: 'Get started with your estimate' })
      .locator('xpath=ancestor::div[1]');
  }

  serviceSelectionPanel(): Locator {
    return this.page
      .getByRole('heading', { name: 'Add to this estimate' })
      .locator('xpath=ancestor::div[.//h2[normalize-space()="Compute Engine"]][1]');
  }

  instancesConfigurationPanel(): Locator {
    return this.page
      .getByRole('heading', { name: /Instances configuration/i })
      .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]');
  }

  instancesCountSection(): Locator {
    return this.page
      .getByText('Number of instances*', { exact: true })
      .locator('xpath=ancestor::div[.//button[@aria-label="Increment"]][1]');
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
    if (await chatMessage.isVisible()) {
      await this.page.keyboard.press('Escape');
    }
  }

  async selectLanguage(localeCode: string): Promise<void> {
    await this.dismissPricingChatWidget();
    await this.footer().scrollIntoViewIfNeeded();
    await this.languageSelector().click({ force: true });

    const listbox = this.page.getByRole('listbox', { name: 'Language Selector Menu' });
    await listbox.waitFor({ state: 'visible' });
    await listbox.locator(`[role="option"][data-value="${localeCode}"]`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openAddEstimateDialog(): Promise<void> {
    await this.addEstimateButton().click();
    await this.addEstimationDialogHeading().waitFor({ state: 'visible' });
  }

  async selectComputeEngine(): Promise<void> {
    await this.computeEngineOption().click();
  }

  async openInstanceConfiguration(): Promise<void> {
    await this.viewDetailsButton().click();
    await this.configurationBlock().waitFor({ state: 'visible' });
  }

  async closeAddEstimateDialog(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.addEstimationDialogHeading().waitFor({ state: 'hidden' });
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.openAddEstimateDialog();
    await this.selectComputeEngine();
    await this.viewDetailsButton().click();
    await this.configurationBlock().waitFor({ state: 'visible' });
    await this.waitForStableMonthlyCost();
  }

  async addInstances(count: number): Promise<void> {
    const incrementButton = this.incrementInstancesButton();
    await incrementButton.scrollIntoViewIfNeeded();

    for (let i = 0; i < count; i++) {
      await incrementButton.click();
    }
  }

  async removeInstances(count: number): Promise<void> {
    const decrementButton = this.decrementInstancesButton();
    await decrementButton.scrollIntoViewIfNeeded();

    for (let i = 0; i < count; i++) {
      await decrementButton.click();
    }
  }

  async getMonthlyCostText(): Promise<string> {
    const text = await this.monthlyCost().textContent();
    return text?.trim() ?? '';
  }

  priceLabels(): Locator {
    return this.page.getByText(/\$\d+[\d,]*\.\d{2}/);
  }

  chatConfigureButton(): Locator {
    return this.page.getByRole('button', { name: /Chat to configure/i });
  }

  async prepareForScreenshot(): Promise<void> {
    await this.dismissCookieBanner();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.evaluate(async () => {
      await document.fonts.ready;

      await Promise.all(
        [...document.images].map((image) => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
          });
        }),
      );
    });

    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          animation-duration: 0s !important;
          transition: none !important;
          transition-duration: 0s !important;
          caret-color: transparent !important;
        }
      `,
    });
  }

  screenshotMasks(): Locator[] {
    return [this.priceLabels(), this.chatConfigureButton(), this.monthlyCost()];
  }

  async prepareComputeEngineSectionScreenshot(section: Locator): Promise<void> {
    await this.waitForStableMonthlyCost();
    await this.prepareForScreenshot();
    await section.scrollIntoViewIfNeeded();
  }

  parseMonthlyCost(costText: string): number {
    const match = costText.match(/\$([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(',', '')) : NaN;
  }

  private async openComboboxAndSelect(combobox: Locator, option: Locator): Promise<void> {
    const visibleOption = option.filter({ visible: true }).first();

    await combobox.scrollIntoViewIfNeeded();

    await expect(async () => {
      await combobox.click();
      await expect(visibleOption).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });

    await visibleOption.scrollIntoViewIfNeeded();
    await visibleOption.click();
  }

  async selectSeries(series: string): Promise<void> {
    await this.openComboboxAndSelect(
      this.seriesCombobox(),
      this.page.locator(`[role="option"][data-value="${series.toLowerCase()}"]`),
    );
    await this.seriesCombobox()
      .filter({ hasText: new RegExp(series, 'i') })
      .waitFor({ state: 'visible' });
  }

  async selectMachineType(machineType: string): Promise<void> {
    await this.openComboboxAndSelect(
      this.machineTypeCombobox(),
      this.page.locator(`[role="option"][data-value="${machineType}"]`),
    );
    await this.machineTypeCombobox().filter({ hasText: machineType }).waitFor({ state: 'visible' });
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
