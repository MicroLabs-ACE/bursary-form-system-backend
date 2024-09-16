import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export enum Role {
  USER = 'user',
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  roles: Role[];
}
