import { z } from 'zod';
import { accountDto } from './account.dto';

export enum Role {
  USER = 'user',
  AUTHORISER = 'authoriser',
}

export enum Salutation {
  MR = 'Mr',
  MRS = 'Mrs',
  DR = 'Dr',
  PROF = 'Prof',
  ENGR = 'Engr',
}

export const userDto = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  roles: z.array(z.nativeEnum(Role)),
  isAcademic: z.boolean(),
  isPermanent: z.boolean(),
  payrollId: z.string(),
  staffCode: z.string(),
  salutation: z.nativeEnum(Salutation),
  salaryAccount: accountDto,
});

export type UserDto = z.infer<typeof userDto>;
