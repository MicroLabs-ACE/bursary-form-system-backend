import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMeta } from 'src/entity/user-meta.entity';
import { MailingModule } from 'src/mailing/mailing.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauth2Strategy } from './google-oauth2.strategy';

@Module({
  imports: [
    MailingModule,
    JwtModule.register({ global: true }),
    TypeOrmModule.forFeature([UserMeta]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauth2Strategy],
})
export class AuthModule {}
