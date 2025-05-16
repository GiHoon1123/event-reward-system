import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { Role } from '../domain/user';
import { CreateUserRequestDto } from '../dto/create-user.request';
import { LoginUserRequestDto } from '../dto/login-user.request';
import { UserService } from '../service/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @ApiOperation({
    summary: '일반 유저 등록',
    description: '보상 요청이 가능한 일반 유저를 등록합니다.',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    examples: {
      user: {
        summary: 'USER 예시',
        value: {
          email: 'user@example.com',
          password: 'securePassword123!',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '등록 성공', type: CommonResponse })
  async registerUser(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.signup(dto.email, dto.password, Role.USER);
    return new CommonResponse(201, 'USER 등록 성공', null);
  }

  @Post('operator')
  @ApiOperation({
    summary: '운영자 등록',
    description: '이벤트 및 보상을 등록할 수 있는 운영자를 등록합니다.',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    examples: {
      operator: {
        summary: 'OPERATOR 예시',
        value: {
          email: 'operator@example.com',
          password: 'securePassword123!',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '등록 성공', type: CommonResponse })
  async registerOperator(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.signup(dto.email, dto.password, Role.OPERATOR);
    return new CommonResponse(201, 'OPERATOR 등록 성공', null);
  }

  @Post('auditor')
  @ApiOperation({
    summary: '감사자 등록',
    description: '보상 이력만 조회할 수 있는 감사자를 등록합니다.',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    examples: {
      auditor: {
        summary: 'AUDITOR 예시',
        value: {
          email: 'auditor@example.com',
          password: 'securePassword123!',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '등록 성공', type: CommonResponse })
  async registerAuditor(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.signup(dto.email, dto.password, Role.AUDITOR);
    return new CommonResponse(201, 'AUDITOR 등록 성공', null);
  }

  @Post('admin')
  @ApiOperation({
    summary: '관리자 등록',
    description: '모든 기능에 접근 가능한 관리자를 등록합니다.',
  })
  @ApiBody({
    type: CreateUserRequestDto,
    examples: {
      admin: {
        summary: 'ADMIN 예시',
        value: {
          email: 'admin@example.com',
          password: 'securePassword123!',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '등록 성공', type: CommonResponse })
  async registerAdmin(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.signup(dto.email, dto.password, Role.ADMIN);
    return new CommonResponse(201, 'ADMIN 등록 성공', null);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiBody({ type: LoginUserRequestDto })
  @ApiCreatedResponse({
    description: '로그인 성공',
    type: CommonResponse,
  })
  async login(
    @Body() dto: LoginUserRequestDto,
  ): Promise<CommonResponse<{ accessToken: string; refreshToken: string }>> {
    const tokens = await this.userService.login(dto.email, dto.password);
    return new CommonResponse(201, '로그인 성공', tokens);
  }
}
