import { test, expect } from '@playwright/test';
import { HomePage, AccountOverviewPage } from '@pages';
import { ParabankApiClient } from '@api/ParabankApiClient';

test('Successful login to the Parabank application.', async ({ page, request }) => {
  // Register new user via API
  const apiClient = new ParabankApiClient(request);
  const user = await apiClient.registerNewUser();
  // Open the ParaBank homepage
  const homePage = new HomePage(page);
  const accountOverviewPage = new AccountOverviewPage(page);
  await homePage.navigate();
  // Validate: The welcome message with customer name
  await homePage.loginForm.login(user.username, user.password);
  await expect(homePage.welcomeMessage).toContainText(`Welcome ${user.firstName} ${user.lastName}`);
  // Validate: Account list is displayed
  await expect(accountOverviewPage.accountsListTable).toBeVisible();
});
