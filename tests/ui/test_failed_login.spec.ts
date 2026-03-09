import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { AccountOverviewPage } from "../../pages/AccountOverviewPage";

test("Test that login fails with invalid credentials and displays appropriate error messages.", async ({
  page,
}) => {
  // Open the ParaBank homepage
  const homePage = new HomePage(page);
  const accountOverviewPage = new AccountOverviewPage(page);
  await homePage.navigate();

  //Login using invalid credentials
  await homePage.loginForm.login("invalidUser", "invalidPass");
  // Validate: An error message is displayed
  await expect(homePage.errorMessage).toBeVisible();
  expect(homePage.errorMessage).toContainText(
    "The username and password could not be verified.",
  );
  // Validate: Accounts page is not accessible
  await expect(page).not.toHaveURL(new RegExp(AccountOverviewPage.path));
  await accountOverviewPage.navigate();
  await expect(page).toHaveURL(new RegExp(AccountOverviewPage.path));
  await expect(accountOverviewPage.accountsListTable).toBeHidden();
  await expect(accountOverviewPage.errorMessage).toBeVisible();
  expect(accountOverviewPage.errorMessage).toContainText(
    "An internal error has occurred and has been logged.",
  );
});
