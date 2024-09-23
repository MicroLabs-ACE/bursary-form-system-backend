import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum MailTemplates {
  EMAIL_OTP_LOGIN,
}

export class MailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsEnum(MailTemplates)
  @IsNotEmpty()
  template: MailTemplates;
}
