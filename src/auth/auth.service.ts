import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMeta } from 'src/schemas/user-meta.schema';
import { UsersService } from 'src/users/users.service';
import { MailDto, MailTemplates } from '../mailing/dto/mail.dto';
import { OtpDto } from '../mailing/dto/otp.dto';
import { MailingService } from '../mailing/mailing.service';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(UserMeta.name) private userMetaModel: Model<UserMeta>,
  ) {}

  async findAndCreateUserMeta(email: string) {
    const foundUser = await this.usersService.findOne(email);
    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const foundUserMeta = await this.userMetaModel.findOne({ email }).exec();
    if (!foundUserMeta) {
      const createdUserMeta = await this.userMetaModel.create({ email });
      return { user: foundUser, userMeta: createdUserMeta };
    }

    return { user: foundUser, userMeta: foundUserMeta };
  }

  async getUserData(email: string) {
    const foundUser = await this.usersService.findOne(email);
    return foundUser;
  }

  async generateAccessToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_DURATION'),
    });

    return accessToken;
  }

  async generateRefreshToken(payload: PayloadDto) {
    const { email } = payload;
    const refreshToken = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_DURATION'),
      },
    );

    return refreshToken;
  }

  private async generateTokens(payload: PayloadDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async login(userMeta: UserMeta) {
    const foundUserMeta = await this.userMetaModel
      .findOne({ email: userMeta.email })
      .exec();
    const payload: PayloadDto = {
      id: foundUserMeta._id.toHexString(),
      email: userMeta.email,
    };
    return await this.generateTokens(payload);
  }

  async requestOtp(email: string) {
    const [{ user }, otpDto] = await Promise.all([
      this.findAndCreateUserMeta(email),
      this.mailingService.generateOtp(),
    ]);

    const mailDto: MailDto = {
      name: `${user.firstName} ${user.lastName}`,
      contact: user.email,
      message: otpDto.token,
      template: MailTemplates.EMAIL_OTP_LOGIN,
    };

    await Promise.all([
      this.mailingService.sendEmail(mailDto),
      this.userMetaModel.updateOne({ email }, { secret: otpDto.secret }),
    ]);
  }

  async verifyOtp(email: string, token: string) {
    const foundUserMeta = await this.userMetaModel.findOne({ email });
    const otpDto: OtpDto = { token, secret: foundUserMeta.secret };
    const isValid = await this.mailingService.validateOtp(otpDto);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    return foundUserMeta;
  }
}
