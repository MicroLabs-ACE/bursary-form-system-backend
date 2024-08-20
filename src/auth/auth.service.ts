import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailingService } from '../mailing/mailing.service';
import { MailDto, MailTemplate } from '../mailing/dto/mail.dto';
import { OtpDto } from '../mailing/dto/otp.dto';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async sendOtp(email: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });
    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const otpDto: OtpDto = await this.mailingService.generateOtp();
    await this.usersRepository.update({ email }, { secret: otpDto.secret });

    const mailDto: MailDto = {
      name: `${foundUser.firstName} ${foundUser.lastName}`,
      contact: foundUser.email,
      message: otpDto.token,
      template: MailTemplate.EMAIL_OTP_LOGIN,
    };
    await this.mailingService.sendEmail(mailDto);
  }

  async verifyOtp(email: string, token: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });
    const otpDto: OtpDto = { token, secret: foundUser.secret };
    const isValid = await this.mailingService.validateOtp(otpDto);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
    return isValid;
  }
}
