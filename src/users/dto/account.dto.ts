import { z } from 'zod';

export const accountDto = z.object({
  bank: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
});

export type AccountDto = z.infer<typeof accountDto>;
