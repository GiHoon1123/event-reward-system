// src/user/dto/create-user.request.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../domain/user';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '회원가입할 이메일 주소',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123!',
    description: '비밀번호 (최소 8자 이상)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'USER',
    required: false,
    enum: Role,
    description: '역할 (기본값: USER)',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
