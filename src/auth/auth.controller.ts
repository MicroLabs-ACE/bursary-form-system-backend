import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOauth2Guard } from './google-oauth2.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2() {}

  @Get('google/callback')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2Callback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user } = request;
    const { accessToken } = await this.authService.login(user);
    response.cookie('access_token', accessToken);
    response.status(200).json({ message: 'Logged in successfully' });
  }

  @Post('otp/request')
  async requestOtp(@Body('email') email: string) {
    await this.authService.requestOtp(email);
  }

  @Post('otp/mrequest')
  async mockRequestOtp(@Body('email') email: string) {
    return await this.authService.mockRequestOtp(email);
  }

  @Post('otp/verify')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() response: Response,
  ) {
    const { email, otp } = verifyOtpDto;
    const user = await this.authService.verifyOtp(email, otp);
    const { accessToken } = await this.authService.login(user);
    response.cookie('access_token', accessToken);
    response.status(200).json({ message: 'Logged in successfully' });
  }

  @Post('otp/mverify')
  async mockVerifyOtp(@Body() body: any, @Res() response: Response) {
    const { email, token, secret } = body;
    const user = await this.authService.mockVerifyOtp(email, token, secret);
    const { accessToken } = await this.authService.login(user);
    response.cookie('access_token', accessToken);
    response.status(200).json({ message: 'Logged in successfully' });
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async dashboard() {
    return 'This is the dashboard';
  }
}
