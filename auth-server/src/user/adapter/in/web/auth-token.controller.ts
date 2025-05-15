// src/user/adapter/in/web/auth-token.controller.ts

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { RefreshAccessTokenCommand } from 'src/user/application/port/in/command/refresh-access-token.command';
import { RefreshAccessTokenUseCase } from 'src/user/application/port/in/refresh-access-token.usecase';
import { RefreshTokenRequestDto } from './dto/refresh-token.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthTokenController {
  constructor(
    @Inject('RefreshAccessTokenUseCase')
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
  ) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Access Token 재발급',
    description:
      '리프레시 토큰을 검증하여 새로운 액세스 토큰을 발급합니다. 리프레시 토큰은 로그인 시 함께 발급되며, 서버 DB에 저장됩니다.',
  })
  @ApiCreatedResponse({
    description: '액세스 토큰 재발급 성공',
    type: CommonResponse,
  })
  async refresh(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<CommonResponse<{ accessToken: string }>> {
    const command = new RefreshAccessTokenCommand(dto.refreshToken);
    const result = await this.refreshAccessTokenUseCase.execute(command);
    return new CommonResponse(201, 'Access Token 재발급 성공', result);
  }
}
