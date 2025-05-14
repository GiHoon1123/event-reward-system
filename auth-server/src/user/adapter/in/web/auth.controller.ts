// src/user/adapter/in/web/auth.controller.ts

import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { LoginUserCommand } from 'src/user/application/port/in/command/login-user.command';
import { RefreshAccessTokenCommand } from 'src/user/application/port/in/command/refresh-access-token.command';
import { UpdateUserRoleCommand } from 'src/user/application/port/in/command/update-user-role.command';
import { LoginUserUseCase } from 'src/user/application/port/in/login-user-usecase';
import { RefreshAccessTokenUseCase } from 'src/user/application/port/in/refresh-access-token.usecase';
import { SignupUserUseCase } from 'src/user/application/port/in/signup-user.usecase';
import { UpdateUserRoleUseCase } from 'src/user/application/port/in/update-user-role.usecase';
import { SignupUserCommand } from '../../../application/port/in/command/signup-user.command';
import { User } from '../../../domain/user';
import { CreateUserRequestDto } from './dto/create-user.request';
import { LoginUserRequestDto } from './dto/login-user.request';
import { RefreshTokenRequestDto } from './dto/refresh-token.request';
import { UpdateUserRoleRequestDto } from './dto/update-user-role.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('SignupUserUseCase')
    private readonly signupUserUseCase: SignupUserUseCase,
    @Inject('LoginUserUseCase')
    private readonly loginUserUseCase: LoginUserUseCase,
    @Inject('RefreshAccessTokenUseCase')
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    @Inject('UpdateUserRoleUseCase')
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 역할을 입력받아 신규 유저를 등록합니다. 역할을 지정하지 않으면 기본값은 USER입니다.',
  })
  @ApiCreatedResponse({ description: '회원가입 성공', type: CommonResponse })
  async signup(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<User>> {
    const command = new SignupUserCommand(dto.email, dto.password, dto.role);
    await this.signupUserUseCase.execute(command);
    return new CommonResponse(201, '회원가입 성공', null);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiCreatedResponse({
    description: '로그인 성공',
    type: CommonResponse,
  })
  async login(
    @Body() dto: LoginUserRequestDto,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const command = new LoginUserCommand(dto.email, dto.password);
    const tokens = await this.loginUserUseCase.execute(command);
    return new CommonResponse(201, '로그인 성공', tokens);
  }

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

  @Post('change-role')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '유저 역할 변경',
    description: '관리자가 특정 유저의 역할을 변경합니다.',
  })
  async changeUserRole(
    @Body() dto: UpdateUserRoleRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new UpdateUserRoleCommand(dto.email, dto.role);

    await this.updateUserRoleUseCase.execute(command);
    return new CommonResponse(200, '역할이 성공적으로 변경되었습니다.');
  }
}
