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
    ) as string;
    this.refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    ) as string;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { accessToken, refreshToken } =
      await this.extractTokensFromHeaders(request);
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Token(s) not found');
    }

    const { payload, isExpired } = await this.verifyToken(
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
        await this.authService.generateAccessToken(payload);
      response.setHeader('Authorization', `Bearer ${refreshedAccessToken}`);
      const refreshedRefreshToken =
        await this.authService.generateRefreshToken(payload);
      response.setHeader('Refresh-Token', `Bearer ${refreshedRefreshToken}`);
    }
    request.user = await this.authService.getUser(payload.email);
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
        const decodedToken = this.jwtService.decode(token);
        const payload: PayloadDto = {
          email: decodedToken.email,
          id: decodedToken.id,
        };
        return { payload, isExpired: true };
      } else {
        throw new UnauthorizedException(err.message);
      }
    }
  }

  private async extractTokensFromHeaders(request: Request) {
    const authorizationHeader = request.header('authorization') as string;
    const refreshTokenHeader = request.header('refresh-token') as string;

    return {
      accessToken: authorizationHeader.replace('Bearer ', ''),
      refreshToken: refreshTokenHeader.replace('Bearer ', ''),
    };
  }
}
