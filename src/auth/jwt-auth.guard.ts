import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { accessToken, refreshToken } =
      await this.extractTokensFromCookie(request);
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Token(s) not found');
    }

    const { payload: accessTokenPayload, isExpired } = await this.verifyToken(
      accessToken,
      this.accessTokenSecret,
    );

    if (isExpired) {
      const { isExpired } = await this.verifyToken(
        refreshToken,
        this.refreshTokenSecret,
      );

      if (isExpired) {
        throw new UnauthorizedException('Token expired');
      }

      const refreshedAccessToken =
        await this.authService.generateAccessToken(accessTokenPayload);
      response.cookie('access_token', refreshedAccessToken);
      const refreshedRefreshToken =
        await this.authService.generateRefreshToken(accessTokenPayload);
      response.cookie('refresh_token', refreshedRefreshToken);
    }

    return true;
  }

  private async verifyToken(token: string, secret: string) {
    try {
      const payload: PayloadDto = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      return { payload, isExpired: false };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        const payload: PayloadDto = this.jwtService.decode(token);
        return { payload, isExpired: true };
      } else {
        throw new UnauthorizedException(err.message);
      }
    }
  }

  private async extractTokensFromCookie(request: Request) {
    return {
      accessToken: request.cookies['access_token'],
      refreshToken: request.cookies['refresh_token'],
    };
  }
}
