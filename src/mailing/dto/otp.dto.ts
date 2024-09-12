import { IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  secret: string;

  @IsString()
  token: string;
}
