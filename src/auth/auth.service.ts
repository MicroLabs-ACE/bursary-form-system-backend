import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMeta } from 'src/entity/user-meta.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MailDto, MailTemplates } from '../mailing/dto/mail.dto';
import { OtpDto } from '../mailing/dto/otp.dto';
import { MailingService } from '../mailing/mailing.service';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserMeta)
    private userMetaRepository: Repository<UserMeta>,
    private readonly configService: ConfigService,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async findAndCreateUserMeta(email: string) {
    const foundUser = await this.usersService.findOne(email);
    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const foundUserMeta = await this.userMetaRepository.findOneBy({ email });
    if (!foundUserMeta) {
      const newUserMeta = this.userMetaRepository.create({ email });
      const createdUserMeta = await this.userMetaRepository.save(newUserMeta);
      return { user: foundUser, userMeta: createdUserMeta };
    }

    return { user: foundUser, userMeta: foundUserMeta };
  }

  async generateAccessToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<number>('ACCESS_TOKEN_DURATION'),
    });

    return accessToken;
  }

  async generateRefreshToken(payload: PayloadDto) {
    const { email } = payload;
    const refreshToken = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>('REFRESH_TOKEN_DURATION'),
      },
    );

    return refreshToken;
  }

  private async generateTokens(payload: PayloadDto) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async login(userMeta: UserMeta) {
    const payload: PayloadDto = { id: userMeta.id, email: userMeta.email };
    return await this.generateTokens(payload);
  }

  async requestOtp(email: string) {
    const { user } = await this.findAndCreateUserMeta(email);
    const otpDto: OtpDto = await this.mailingService.generateOtp();
    const mailDto: MailDto = {
      name: `${user.firstName} ${user.lastName}`,
      contact: user.email,
      message: otpDto.token,
      template: MailTemplates.EMAIL_OTP_LOGIN,
    };

    await Promise.all([
      this.mailingService.sendEmail(mailDto),
      this.userMetaRepository.update({ email }, { secret: otpDto.secret }),
    ]);
  }

  async verifyOtp(email: string, token: string) {
    const foundUserMeta = await this.userMetaRepository.findOneBy({ email });
    const otpDto: OtpDto = { token, secret: foundUserMeta.secret };
    const isValid = await this.mailingService.validateOtp(otpDto);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    return foundUserMeta;
  }
}
