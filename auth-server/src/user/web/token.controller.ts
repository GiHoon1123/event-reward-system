import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { UserService } from '../application/user.service';
import { RefreshTokenRequestDto } from './dto/refresh-token.request';
import { AccessTokenResponseDto } from '../application/\bdto/access-token-response';

@ApiTags('Token')
@Controller('auth')
export class TokenController {
  constructor(private readonly userService: UserService) {}

  @Post('token/refresh')
  @ApiOperation({
    summary: '토큰 재발급',
    description: '리프레시 토큰을 사용해 새로운 액세스 토큰을 발급합니다.',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Access Token 재발급 성공',
    schema: {
      example: {
        statusCode: 201,
        message: 'Access Token 재발급 성공',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODI2N2ZlMDU5NzA3ZjdhNzM0MDMyODciLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NzM1MzYwNCwiZXhwIjoxNzQ3OTU4NDA0fQ.N1iyhX6lroUr0AiuuK3V2-TRvlZtrQJYgEYv7MFV4pU',
        },
      },
    },
  })
  async refreshToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<CommonResponse<AccessTokenResponseDto>> {
    const result = await this.userService.refresh(dto.refreshToken);
    return new CommonResponse(201, 'Access Token 재발급 성공', result);
  }
}
