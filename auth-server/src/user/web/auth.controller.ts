import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { LoginCommand } from '../application/\bcommand/login.command';
import { RegisterUserCommand } from '../application/\bcommand/register-user.command';
import { LoginResponseDto } from '../application/\bdto/login-response';
import { UserService } from '../application/user.service';
import { Role } from '../domain/user';
import { LoginUserRequestDto } from './dto/login-user.request';
import { RegisterUserRequestDto } from './dto/register-user.request';

@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register/user')
  @ApiOperation({
    summary: '일반 유저 등록',
    description: '보상 요청이 가능한 일반 유저를 등록합니다.',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
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
  @ApiResponse({
    status: 201,
    description: 'USER 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'USER 등록 성공',
      },
    },
  })
  async registerUser(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RegisterUserCommand(dto.email, dto.password, Role.USER);
    await this.userService.register(command);
    return new CommonResponse(201, 'USER 등록 성공');
  }

  @Post('register/operator')
  @ApiOperation({
    summary: '운영자 등록',
    description: '이벤트 및 보상을 등록할 수 있는 운영자를 등록합니다.',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
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
  @ApiResponse({
    status: 201,
    description: 'OPERATOR 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'OPERATOR 등록 성공',
      },
    },
  })
  async registerOperator(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RegisterUserCommand(dto.email, dto.password, Role.USER);
    await this.userService.register(command);
    return new CommonResponse(201, 'OPERATOR 등록 성공');
  }

  @Post('register/auditor')
  @ApiOperation({
    summary: '감사자 등록',
    description: '보상 이력만 조회할 수 있는 감사자를 등록합니다.',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
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
  @ApiResponse({
    status: 201,
    description: 'AUDITOR 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'AUDITOR 등록 성공',
      },
    },
  })
  async registerAuditor(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RegisterUserCommand(dto.email, dto.password, Role.USER);
    await this.userService.register(command);
    return new CommonResponse(201, 'AUDITOR 등록 성공');
  }

  @Post('register/admin')
  @ApiOperation({
    summary: '관리자 등록',
    description: '모든 기능에 접근 가능한 관리자를 등록합니다.',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
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
  @ApiResponse({
    status: 201,
    description: 'ADMIN 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'ADMIN 등록 성공',
      },
    },
  })
  async registerAdmin(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RegisterUserCommand(dto.email, dto.password, Role.USER);
    await this.userService.register(command);
    return new CommonResponse(201, 'ADMIN 등록 성공');
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiBody({ type: LoginUserRequestDto })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '로그인 성공',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2N2ZlMDU5NzA3ZjdhNzM0MDMyODciLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NzM1MzYwNCwiZXhwIjoxNzQ3OTU4NDA0fQ.N1iyhX6lroUr0AiuuK3V2-TRvlZtrQJYgEYv7MFV4pU',
          refreshToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI123123I2ODI2N2ZlMDU5NzA3ZjdhNzM0MDMyODciLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NzM1MzYwNCwiZXhwIjoxNzQ3OTU4NDA0fQ.N1iyhX6lroUr0AiuuK3V2-TRvlZtrQJYgEYv7MFV4pU',
        },
      },
    },
  })
  async login(
    @Body() dto: LoginUserRequestDto,
  ): Promise<CommonResponse<LoginResponseDto>> {
    const command = new LoginCommand(dto.email, dto.password);
    const tokens = await this.userService.login(command);
    return new CommonResponse(201, '로그인 성공', tokens);
  }
}
