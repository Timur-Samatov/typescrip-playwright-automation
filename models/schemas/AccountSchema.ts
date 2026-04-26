import { z } from 'zod';
import { AccountType } from '../AccountType';

export const AccountSchema = z.object({
  id: z.number().or(z.string()),
  customerId: z.number().or(z.string()),
  type: z.enum(AccountType),
  balance: z.number(),
});
