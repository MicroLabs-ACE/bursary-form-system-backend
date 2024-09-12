import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOauth2Guard } from './google-oauth2.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login page' })
  @Get('google')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2() {}

  @ApiOperation({ summary: 'Google OAuth2 callback' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('google/callback')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2Callback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user } = request;
    const { accessToken, refreshToken } = await this.authService.login(user);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    response.status(200).json({ message: 'Logged in successfully' });
  }

  @ApiOperation({ summary: 'Request OTP' })
  @ApiBody({
    schema: { type: 'object', properties: { email: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('otp/request')
  async requestOtp(@Body('email') email: string) {
    await this.authService.requestOtp(email);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @Post('otp/verify')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() response: Response,
  ) {
    const { email, token } = verifyOtpDto;
    const user = await this.authService.verifyOtp(email, token);
    const { accessToken, refreshToken } = await this.authService.login(user);
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    response.status(200).json({ message: 'Logged in successfully' });
  }

  @ApiOperation({ summary: 'Access dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard accessed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiCookieAuth()
  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async dashboard() {
    return 'This is the dashboard';
  }
}
