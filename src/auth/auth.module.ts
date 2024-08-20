import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailingModule } from '../mailing/mailing.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [MailingModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
