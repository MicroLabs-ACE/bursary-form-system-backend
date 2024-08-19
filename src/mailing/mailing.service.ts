import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'smtpexpress';
import * as speakeasy from 'speakeasy';
import { OtpDto } from './dto/otp.dto';
import { MailDto, MailTemplate } from './dto/mail.dto';

@Injectable()
export class MailingService {
  private emailClient: any;
  private senderEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.emailClient = createClient({
      projectId: this.configService.get<string>('SMTPEXPRESS_PROJECT_ID'),
      projectSecret: this.configService.get<string>(
        'SMTPEXPRESS_PROJECT_SECRET',
      ),
    });

    this.senderEmail = this.configService.get<string>(
      'SMTPEXPRESS_SENDER_EMAIL',
    );
  }

  async generateOtp() {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({ secret, encoding: 'base32' });
    const otpDto: OtpDto = { secret, token };

    return otpDto;
  }

  async validateOtp(otpDto: OtpDto) {
    const isValid = speakeasy.totp.verify({
      secret: otpDto.secret,
      token: otpDto.token,
      encoding: 'base32',
      window: 25,
    });

    return isValid;
  }

  async sendEmail(mailDto: MailDto) {
    let subject: string;
    let message: string;

    switch (mailDto.template) {
      case MailTemplate.EMAIL_OTP_LOGIN:
        subject = 'Email OTP';
        message = `<h1>Your OTP: ${mailDto.message}</h1>`;
        break;

      default:
        throw new NotImplementedException('Mail template not implemented');
    }

    await this.emailClient.sendApi.sendMail({
      subject,
      message,
      sender: {
        name: 'Bursary Form Service',
        email: this.senderEmail,
      },
      recipients: { name: mailDto.name, email: mailDto.contact },
    });
  }
}
