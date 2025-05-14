// src/user/adapter/in/web/dto/update-user-role.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../../../domain/user';

export class UpdateUserRoleRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '역할을 변경할 유저의 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: Role.USER,
    enum: Role,
    description: '변경할 역할',
  })
  @IsEnum(Role)
  role: Role;
}
