import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountOverviewPage extends BasePage {
  static readonly path = "/parabank/overview.htm";
  readonly accountsListTable: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsListTable = page.locator("#accountTable");
  }

  async navigate() {
    await this.page.goto(AccountOverviewPage.path);
  }
}
