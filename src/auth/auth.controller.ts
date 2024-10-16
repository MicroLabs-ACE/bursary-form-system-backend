import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleOauth2Guard } from './google-oauth2.guard';

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
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: [TokensDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('google/callback')
  @UseGuards(GoogleOauth2Guard)
  async googleOauth2Callback(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { user } = request;
    const { accessToken, refreshToken } = await this.authService.login(user);
    const tokensDto = { accessToken, refreshToken };
    response.status(200).json(tokensDto);
  }

  @ApiOperation({ summary: 'Request OTP' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'victoramomodu@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('otp/request')
  async requestOtp(@Body('email') email: string) {
    return await this.authService.requestOtp(email);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'victoramomodu@gmail.com' },
        token: { type: 'string', example: '298128' },
      },
      required: ['email', 'token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: [TokensDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @Post('otp/verification')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() response: Response,
  ) {
    const { email, token } = verifyOtpDto;
    const user = await this.authService.verifyOtp(email, token);
    const { accessToken, refreshToken } = await this.authService.login(user);
    const tokensDto = { accessToken, refreshToken };
    response.status(200).json(tokensDto);
  }
}
