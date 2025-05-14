// src/user/adapter/in/web/dto/login-user.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserRequestDto {
  @ApiProperty({ example: 'user@example.com', description: '유저 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: '비밀번호' })
  @IsNotEmpty()
  password: string;
}
