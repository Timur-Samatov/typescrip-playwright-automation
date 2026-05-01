import { expect, test } from '@playwright/test';
import { ParabankApiClient } from '@api/ParabankApiClient';
import { AccountSchema } from '@models/schemas/AccountSchema';

test('Retrieve account details for a specific customer with validation', async ({ request }) => {
  // Initialize API client
  const apiClient = new ParabankApiClient(request);

  // Register a new user to get fresh user data
  const user = await apiClient.registerNewUser();

  // Get customer ID
  const customerId = user.id;

  // Get accounts by customer ID
  const accountsResponse = await apiClient.getAccountsByCustomerId(customerId.toString());
  const accountId = accountsResponse[0].id;

  // Call /accounts/{id} to get account details
  const accountDetails = await apiClient.getAccountDetails(accountId);

  // Validate: Correct account ID
  expect(accountDetails.id).toBe(accountId);

  // Validate: Balance field is present
  expect(accountDetails).toHaveProperty('balance');

  // Schema validation using Zod
  expect(accountDetails).toMatchSchema(AccountSchema);
});
