import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { MailDto, MailTemplate } from '../mailing/dto/mail.dto';
import { OtpDto } from '../mailing/dto/otp.dto';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('ACCESS_TOKEN_DURATION'),
    });

    return accessToken;
  }

  async generateRefreshToken(payload: any) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_DURATION'),
    });

    return refreshToken;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async requestOtp(email: string) {
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

  async mockRequestOtp(email: string) {
    const otpDto: OtpDto = await this.mailingService.generateOtp();
    const mailDto: MailDto = {
      name: `Victor Momodu`,
      contact: email,
      message: otpDto.token,
      template: MailTemplate.EMAIL_OTP_LOGIN,
    };
    await this.mailingService.sendEmail(mailDto);
    return otpDto;
  }

  async verifyOtp(email: string, token: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });
    const otpDto: OtpDto = { token, secret: foundUser.secret };
    const isValid = await this.mailingService.validateOtp(otpDto);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    return foundUser;
  }

  async mockVerifyOtp(email: string, token: string, secret: string) {
    const otpDto: OtpDto = { token, secret };
    const isValid = await this.mailingService.validateOtp(otpDto);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    return {
      id: 1,
      email,
      firstName: 'Victor',
      lastName: 'Momodu',
      secret,
    };
  }
}
