import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorMessage = this.page.locator(".error");
  }
}
