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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { accessToken, refreshToken } = this.extractTokensFromCookie(request);
    if (!accessToken) {
      throw new UnauthorizedException('No access token found');
    }

    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    try {
      const accessTokenPayload = await this.jwtService.verifyAsync(
        accessToken,
        { secret: accessTokenSecret },
      );
      request['user'] = accessTokenPayload;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        if (!refreshToken) {
          throw new UnauthorizedException('No refresh token found');
        }

        const { sub, email } = await this.jwtService.verifyAsync(refreshToken, {
          secret: refreshTokenSecret,
        });
        const refreshedAccessToken = await this.authService.generateAccessToken(
          { sub, email },
        );
        response.cookie('access_token', refreshedAccessToken);
      } else {
        throw new UnauthorizedException(err.message);
      }
    }

    return true;
  }

  private extractTokensFromCookie(request: Request) {
    return {
      accessToken: request.cookies['access_token'],
      refreshToken: request.cookies['refresh_token'],
    };
  }
}
