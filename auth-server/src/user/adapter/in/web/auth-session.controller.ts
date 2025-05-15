// src/user/adapter/in/web/auth-session.controller.ts

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { LoginUserCommand } from 'src/user/application/port/in/command/login-user.command';
import { SignupUserCommand } from 'src/user/application/port/in/command/signup-user.command';
import { LoginUserUseCase } from 'src/user/application/port/in/login-user-usecase';
import { SignupUserUseCase } from 'src/user/application/port/in/signup-user.usecase';
import { User } from 'src/user/domain/user';
import { CreateUserRequestDto } from './dto/create-user.request';
import { LoginUserRequestDto } from './dto/login-user.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthSessionController {
  constructor(
    @Inject('SignupUserUseCase')
    private readonly signupUserUseCase: SignupUserUseCase,
    @Inject('LoginUserUseCase')
    private readonly loginUserUseCase: LoginUserUseCase,
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
}
