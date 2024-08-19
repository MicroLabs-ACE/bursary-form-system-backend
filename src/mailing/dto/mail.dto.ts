export class MailDto {
  name: string;
  message: string;
  contact: string;
  template: MailTemplate;
}

export enum MailTemplate {
  EMAIL_OTP_LOGIN,
}
