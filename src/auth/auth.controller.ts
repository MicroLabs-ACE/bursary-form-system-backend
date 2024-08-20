import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOauth2Guard } from './google-oauth2.guard';
import { SessionService } from '../session/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('google-oauth2')
  @UseGuards(GoogleOauth2Guard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleOauth2() {}

  @Get('google-oauth2/callback')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2Callback(@Req() request: any, @Res() reply: any) {
    reply.status(200).redirect('/login');
  }

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    await this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    await this.authService.verifyOtp(email, otp);
  }

  @Get('login')
  async login(@Req() request: any, @Res() reply: any) {
    await this.sessionService.setSessionData(
      request,
      reply,
      'user',
      request.user,
    );
  }

  @Get('session')
  async session(@Req() request: any) {
    await this.sessionService.getSessionData(request, 'user');
  }
}
