// src/user/adapter/in/web/user-role.controller.ts

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { UpdateUserRoleCommand } from 'src/user/application/port/in/command/update-user-role.command';
import { UpdateUserRoleUseCase } from 'src/user/application/port/in/update-user-role.usecase';
import { UpdateUserRoleRequestDto } from './dto/update-user-role.request';

@ApiTags('Auth')
@Controller('auth')
export class UserRoleController {
  constructor(
    @Inject('UpdateUserRoleUseCase')
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
  ) {}

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
