import { expect, test } from "@playwright/test";
import { ParabankApiClient } from "../../api/ParabankApiClient";
import { AccountType } from "../../models/AccountType";

test("Test creating a new account for a customer with response validation.", async ({
  request,
}) => {
  const apiClient = new ParabankApiClient(request);
  const user = await apiClient.registerNewUser();

  const accountsResponse = await apiClient.getAccountsByCustomerId(user.id);
  const accountId = accountsResponse[0].id;

  // Send POST to create a new account
  const newAccountResponse = await apiClient.createAccount({
    customerId: user.id,
    fromAccountId: accountId,
    newAccountType: AccountType.SAVINGS,
  });

  // Validate: 200 status
  expect(newAccountResponse.status).toBe(200);
  // Validate: Correct fields in response
  expect(newAccountResponse.data).toHaveProperty("id");
  expect(newAccountResponse.data.customerId).toBe(user.id);
  expect(newAccountResponse.data.type).toBe(AccountType.SAVINGS);
  expect(newAccountResponse.data.balance).toBe(0);
});
