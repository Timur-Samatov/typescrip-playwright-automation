import { expect, test } from '@playwright/test';
import { ParabankApiClient } from '@api/ParabankApiClient';
import { AccountType } from '@models/AccountType';
import { AccountSchema } from '@models/schemas/AccountSchema';

test('Test creating a new account for a customer with Zod response validation.', async ({
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

  // Validate response shape using custom toMatchSchema matcher (article best practice)
  const newAccount = await newAccountResponse.data;
  await expect(newAccount).toMatchSchema(AccountSchema);

  // Validate specific values
  expect(newAccount.customerId).toEqual(user.id);
  expect(newAccount.type).toEqual(AccountType.SAVINGS);
  expect(newAccount.balance).toBe(0);
});
