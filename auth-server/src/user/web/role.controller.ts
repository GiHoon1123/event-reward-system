import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { UserService } from '../application/user.service';
import { UpdateUserRoleRequestDto } from './dto/update-user-role.request';

@ApiTags('Role')
@Controller('auth')
export class RoleController {
  constructor(private readonly userService: UserService) {}

  @Post('users/change-role')
  @ApiOperation({
    summary: '역할 변경',
    description:
      '관리자가 유저의 역할을 변경합니다. ADMIN 권한이 필요하며 USER, OPERATOR, AUDITOR, ADMIN 중 하나로 변경할 수 있습니다.',
  })
  @ApiBody({ type: UpdateUserRoleRequestDto })
  @ApiResponse({
    status: 201,
    description: '역할 변경 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '역할 변경 성공',
      },
    },
  })
  async changeUserRole(
    @Body() dto: UpdateUserRoleRequestDto,
  ): Promise<CommonResponse<null>> {
    await this.userService.changeRole(dto.email, dto.role);
    return new CommonResponse(201, '역할 변경 성공');
  }
}
