import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  is_paid: boolean;

  @IsBoolean()
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  is_active: boolean;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  language: string;
}
