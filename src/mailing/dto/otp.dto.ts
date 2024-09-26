import { z } from 'zod';

export const otpDto = z
  .object({ secret: z.string(), token: z.string() })
  .required();

export type OtpDto = z.infer<typeof otpDto>;
