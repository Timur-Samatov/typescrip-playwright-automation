import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ActivityPage extends BasePage {
    readonly accountNomberLabel: Locator;
    readonly accountNumberValue: Locator;
    readonly balanceLabel: Locator;
    readonly balanceValue: Locator;
    readonly accountTypeLabel: Locator;
    readonly accountTypeValue: Locator;
    readonly transactionsTable: Locator;

    constructor(page: Page) {
        super(page);
        this.accountNomberLabel = this.page.getByText("Account Number:");
        this.accountNumberValue = this.page.locator("#accountId");
        this.balanceLabel = this.page.getByText("Balance:");
        this.balanceValue = this.page.locator("#balance");
        this.accountTypeLabel = this.page.getByText("Account Type:");
        this.accountTypeValue = this.page.locator("#accountType");
        this.transactionsTable = this.page.locator("#transactionTable");
    }

    async navigate(accountId: number) {
        await this.page.goto(`/parabank/activity.htm?id=${accountId}`);
    }
}


