import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token.request';
import { UserService } from '../service/user.service';

@ApiTags('Token')
@Controller('tokens')
export class TokenController {
  constructor(private readonly userService: UserService) {}

  @Post('refresh')
  @ApiOperation({
    summary: '토큰 재발급',
    description: '리프레시 토큰을 사용해 새로운 액세스 토큰을 발급합니다.',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiCreatedResponse({
    description: '재발급 성공',
    type: CommonResponse,
  })
  async refreshToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<CommonResponse<{ accessToken: string }>> {
    const result = await this.userService.refresh(dto.refreshToken);
    return new CommonResponse(201, 'Access Token 재발급 성공', result);
  }
}
