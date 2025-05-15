import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '로그인할 이메일 주소',
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
}
