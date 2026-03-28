import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransferPage extends BasePage {
    readonly transferAmountInput: Locator;
    readonly fromAccountIdInput: Locator;
    readonly toAccountIdInput: Locator;
    readonly transferButton: Locator;
    readonly resultMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.transferAmountInput = page.locator("#amount");
        this.fromAccountIdInput = page.locator("#fromAccountId");
        this.toAccountIdInput = page.locator("#toAccountId");
        this.transferButton = page.locator("input[value='Transfer']");
        this.resultMessage = page.locator("#showResult");
    }

    async transferFunds({ amount, fromAccountId, toAccountId }: { amount: number; fromAccountId: number; toAccountId: number }) {
        await this.transferAmountInput.fill(amount.toString());
        await this.fromAccountIdInput.selectOption(fromAccountId.toString());
        await this.toAccountIdInput.selectOption(toAccountId.toString());
        await this.transferButton.click();
    }

    async navigate() {
        await this.page.goto("/parabank/transfer.htm");
    }
}


