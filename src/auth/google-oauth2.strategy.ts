import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserMeta } from 'src/entity/user-meta.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleOauth2Strategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject() private configService: ConfigService,
    @InjectRepository(UserMeta)
    private userMetaRepository: Repository<UserMeta>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails } = profile;
    const email = emails[0].value;
    const { userMeta } = await this.authService.findAndCreateUserMeta(email);
    done(null, userMeta);
  }
}
