// src/user/adapter/in/web/dto/create-user.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../../../../domain/user';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'user@example.com', description: '유저 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: '비밀번호 (최소 6자)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'USER',
    enum: Role,
    description: '유저 역할 (기본값: USER)',
  })
  @IsOptional()
  role?: Role = Role.USER;
}
