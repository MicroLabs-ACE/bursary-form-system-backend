import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { MailingModule } from 'src/mailing/mailing.module';
import { GoogleOauth2Strategy } from './google-oauth2.strategy';

@Module({
  imports: [MailingModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauth2Strategy],
})
export class AuthModule {}
