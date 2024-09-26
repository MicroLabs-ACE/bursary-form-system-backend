import { z } from 'zod';

export const payloadDto = z
  .object({
    email: z.string().email(),
    id: z.string().uuid(),
  })
  .required();

export type PayloadDto = z.infer<typeof payloadDto>;
