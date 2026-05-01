import { z } from 'zod';
import { AccountType } from '../AccountType';

export const AccountSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  type: z.enum(AccountType),
  balance: z.number(),
});
