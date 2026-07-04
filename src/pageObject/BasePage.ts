export class BasePage {
  constructor(private readonly path: string) {}

  open(): Promise<void> {
    return browser.url(this.path);
  }
}
