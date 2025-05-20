import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from 'src/user/domain/user';

export class UpdateUserRoleRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '역할을 변경할 대상 유저 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'ADMIN',
    enum: Role,
    description: '변경할 역할 (USER, OPERATOR, AUDITOR, ADMIN)',
  })
  @IsEnum(Role)
  role: Role;
}
