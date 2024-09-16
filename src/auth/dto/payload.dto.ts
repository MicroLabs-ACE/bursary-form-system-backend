import { IsEmail, IsUUID } from 'class-validator';

export class PayloadDto {
  @IsEmail()
  email: string;

  @IsUUID()
  id: string;
}
