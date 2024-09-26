import { z } from 'zod';

export enum MailTemplates {
  EMAIL_OTP_LOGIN,
}

export const mailDto = z
  .object({
    name: z.string(),
    message: z.string(),
    contact: z.string(),
    template: z.nativeEnum(MailTemplates),
  })
  .required();

export type MailDto = z.infer<typeof mailDto>;
