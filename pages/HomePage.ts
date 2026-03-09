import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { LoginForm } from "./components/LoginForm";

export class HomePage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly loginForm: LoginForm;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator("#leftPanel .smallText");
    this.loginForm = new LoginForm(page);
  }

  async navigate() {
    await this.page.goto("");
  }
}
