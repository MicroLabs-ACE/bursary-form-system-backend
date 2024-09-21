import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MailingModule } from 'src/mailing/mailing.module';
import { UserMeta, UserMetaSchema } from 'src/schemas/user-meta.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauth2Strategy } from './google-oauth2.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    MailingModule,
    JwtModule.register({ global: true }),
    UsersModule,
    MongooseModule.forFeature([
      { name: UserMeta.name, schema: UserMetaSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleOauth2Strategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
