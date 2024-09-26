import { z } from 'zod';

export const verifyOtpDto = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpDto>;
