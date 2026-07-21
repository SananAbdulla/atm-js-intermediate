import { Page } from '@playwright/test';

export class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly path: string,
  ) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }
}
