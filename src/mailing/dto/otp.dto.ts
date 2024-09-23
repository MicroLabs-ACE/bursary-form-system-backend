import { IsNotEmpty, IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
