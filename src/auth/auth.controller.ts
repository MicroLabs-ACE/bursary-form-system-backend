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
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauth2Guard } from './google-oauth2.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google-oauth2')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2() {}

  @Get('google-oauth2/callback')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2Callback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    response.json({ message: request.user });
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
}
