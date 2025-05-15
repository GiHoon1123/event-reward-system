// src/user-event/web/user-progress.controller.ts

import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { IncreaseLoginCountCommand } from '../application/command/increase-login-count.command';
import { UserProgressService } from '../application/service/user-progress.service';

@ApiTags('UserEvent')
@Controller('user-event/progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Post('login')
  @ApiHeader({
    name: 'x-user-email',
    description: '로그인한 유저의 이메일 (예: user@example.com)',
    required: true,
  })
  @ApiOperation({
    summary: '유저 로그인 진행도 증가',
    description:
      '로그인 성공 시 호출되어 해당 유저의 로그인 횟수를 증가시킵니다.',
  })
  async increaseLoginCount(
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new IncreaseLoginCountCommand(email);
    await this.userProgressService.increaseLoginCount(command);
    return new CommonResponse(201, '유저 로그인 진행도가 증가했습니다.');
  }

  @Get(':eventId')
  @ApiHeader({
    name: 'x-user-email',
    description: '요청 유저 이메일 (예 user@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '진행도를 확인할 이벤트 ID',
    example: '68253391f243bc0bb1165f0b',
  })
  @ApiOperation({
    summary: '유저 이벤트 진행도 확인',
    description: `
유저가 특정 이벤트의 조건을 얼마나 충족했는지 확인합니다.  
조건은 현재 로그인 횟수(LOGIN_COUNT)로 고정되어 있으며,  
진행률(%), 현재 카운트, 필요 카운트, 조건 만족 여부를 함께 반환합니다.
    `,
  })
  @ApiResponse({
    status: 200,
    description: '진행도 조회 성공',
    type: CommonResponse,
  })
  async getProgress(
    @Param('eventId') eventId: string,
    @Headers('x-user-email') email: string,
  ): Promise<
    CommonResponse<{
      eventId: string;
      current: number;
      required: number;
      met: boolean;
      rate: number;
    }>
  > {
    const info = await this.userProgressService.getProgressInfo(eventId, email);

    return new CommonResponse(200, '이벤트 진행도 조회 성공', {
      eventId: info.eventId,
      current: info.current,
      required: info.required,
      met: info.isSatisfied(),
      rate: info.getRate(),
    });
  }
}
