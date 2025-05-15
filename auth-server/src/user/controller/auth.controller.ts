import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateUserRequestDto } from '../dto/create-user.request';
import { LoginUserRequestDto } from '../dto/login-user.request';
import { UserService } from '../service/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일, 비밀번호, 역할을 입력받아 유저를 등록합니다.',
  })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiCreatedResponse({
    description: '회원가입 성공',
    type: CommonResponse,
  })
  async signup(
    @Body() dto: CreateUserRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.signup(dto.email, dto.password, dto.role);
    return new CommonResponse(201, '회원가입 성공', null);
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
