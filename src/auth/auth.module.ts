import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { MailingModule } from 'src/mailing/mailing.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauth2Strategy } from './google-oauth2.strategy';

@Module({
  imports: [
    MailingModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauth2Strategy],
})
export class AuthModule {}
