import { test, expect } from '@playwright/test';
import { HomePage, TransferPage, ActivityPage } from '@pages';
import { ParabankApiClient } from '@api/ParabankApiClient';
import { AccountType } from '@models/AccountType';

test('Transferring funds between accounts.', async ({ page, request }) => {
  const homePage = new HomePage(page);
  const transferPage = new TransferPage(page);
  const activityPage = new ActivityPage(page);

  // Register new user via API
  const apiClient = new ParabankApiClient(request);
  const user = await apiClient.registerNewUser();
  // Get existing account Id
  const accountsResponse = await apiClient.getAccountsByCustomerId(user.id);
  // Create destination account
  const sourceAccountId = accountsResponse[0].id;
  const newAccountResponse = await apiClient.createAccount({
    customerId: user.id,
    fromAccountId: sourceAccountId,
    newAccountType: AccountType.CHECKING,
  });
  // Get balance of source account before transfer
  const sourceAccountDetails = await apiClient.getAccountDetails(sourceAccountId);
  const initialSourceBalance = sourceAccountDetails.balance;
  // Get balance of destination account before transfer
  const destinationAccountId = newAccountResponse.data.id;
  const destinationAccountDetails = await apiClient.getAccountDetails(destinationAccountId);
  const destinationAccountBalance = destinationAccountDetails.balance;

  // Navigate to "Transfer Funds" page
  await homePage.navigate();
  // Validate: The welcome message with customer name
  await homePage.loginForm.login(user.username, user.password);
  await transferPage.navigate();
  // Transfer an amount (e.g., 3 USD) from one account to another
  const transferAmount = 3.0;
  await transferPage.transferFunds({
    amount: transferAmount,
    fromAccountId: sourceAccountId,
    toAccountId: destinationAccountId,
  });
  // Validate: Success message
  await expect(transferPage.resultMessage).toBeVisible();
  await expect(transferPage.resultMessage).toContainText('Transfer Complete!');
  await expect(transferPage.resultMessage).toContainText(
    `${transferAmount.toFixed(2)} has been transferred from account #${sourceAccountId} to account #${destinationAccountId}.`,
  );
  // Validate: Balances changed correctly (before → after)
  await activityPage.navigate(sourceAccountId);
  // Calculate expected balance and format it correctly
  const sourceAccountExpectedBalance = initialSourceBalance - transferAmount;
  // Check balance changed correctly for source account
  await expect(activityPage.balanceValue).toHaveText(
    sourceAccountExpectedBalance.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  );
  // Check balance changed correctly for destination account
  await activityPage.navigate(destinationAccountId);
  const expectedDestinationBalance = destinationAccountBalance + transferAmount;
  await expect(activityPage.balanceValue).toHaveText(
    expectedDestinationBalance.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  );
});
