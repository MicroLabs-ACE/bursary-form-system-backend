import { IsEnum, IsString } from 'class-validator';

export enum MailTemplates {
  EMAIL_OTP_LOGIN,
}

export class MailDto {
  @IsString()
  name: string;

  @IsString()
  message: string;

  @IsString()
  contact: string;

  @IsEnum(MailTemplates)
  template: MailTemplates;
}
