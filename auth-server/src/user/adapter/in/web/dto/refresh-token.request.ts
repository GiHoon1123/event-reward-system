// src/user/adapter/in/web/dto/refresh-token.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: '리프레시 토큰 (Refresh Token)',
  })
  @IsNotEmpty()
  refreshToken: string;
}
