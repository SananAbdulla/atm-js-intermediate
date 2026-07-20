export class BasePage {
  constructor(private readonly path: string) {}

  async open(): Promise<void> {
    await browser.url(this.path);
  }
}
