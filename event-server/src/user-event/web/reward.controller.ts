// src/user-event/web/reward-request.controller.ts

import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import {
  PaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/paginated-response.dto';
import { RewardService } from 'src/user-event/application/service/reward.service';
import { RequestRewardCommand } from '../application/command/request-reward.command';
import { RewardClaimHistory } from '../domain/reward-claim-history';
import { ClaimRewardRequestDto } from './dto/claim-reward.request';

@ApiTags('UserReward')
@Controller('user-event/rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post(':eventId')
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: user@example.com)',
  })
  @ApiParam({
    name: 'eventId',
    required: true,
    example: '6825653f6689c6a42ea1e038',
    description: '보상을 요청할 이벤트 ID',
  })
  @ApiBody({
    type: ClaimRewardRequestDto,
    examples: {
      default: {
        summary: '보상 요청 예시',
        value: {
          name: '코어 잼스톤',
          amount: 100,
        },
      },
    },
  })
  @ApiOperation({
    summary: '유저 보상 요청',
    description: `
    유저가 이벤트 조건을 만족한 경우, 보상을 요청합니다.  
    - 보상은 일부만 요청할 수도 있고, 전체 수령도 가능합니다.  
    - 이미 수령한 보상은 자동으로 무시되지 않습니다. 초과 요청만 거부됩니다.
    - 성공/실패 여부는 개별 보상 기준이며 모두 기록됩니다.
    `,
  })
  async requestReward(
    @Param('eventId') eventId: string,
    @Headers('x-user-email') email: string,
    @Body() rewards: ClaimRewardRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RequestRewardCommand(eventId, email, [
      {
        type: 'ITEM',
        name: rewards.name,
        amount: rewards.amount,
      },
    ]);

    await this.rewardService.requestReward(command);

    return new CommonResponse(201, '보상 요청이 처리되었습니다.');
  }

  @Get(':eventId/available')
  @ApiHeader({
    name: 'x-user-email',
    description: 'Gateway에서 전달된 사용자 이메일 (예: user@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    example: '6825653f6689c6a42ea1e038',
  })
  @ApiOperation({
    summary: '수령 가능 보상 목록 조회',
    description:
      '유저가 아직 수령하지 않은 보상 목록과 남은 개수를 반환합니다.',
  })
  async getAvailableRewards(
    @Param('eventId') eventId: string,
    @Headers('x-user-email') email: string,
  ): Promise<
    CommonResponse<
      {
        name: string;
        type: string;
        availableAmount: number;
      }[]
    >
  > {
    const result = await this.rewardService.getAvailableRewards(eventId, email);
    return new CommonResponse(200, '남은 보상 목록 조회 성공', result);
  }

  @Get('/user-event/rewards/history')
  @ApiOperation({ summary: '유저 보상 요청 이력 조회' })
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: user@example.com)',
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: true,
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'limit',
    example: 20,
    required: true,
    description: '페이지당 항목 수',
  })
  async getUserHistory(
    @Headers('x-user-email') email: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaginatedResponse<RewardClaimHistory>> {
    const { totalCount, items } =
      await this.rewardService.getUserHistoriesWithPage(
        email,
        Number(page),
        Number(limit),
      );
    const meta = new PaginationMeta(Number(page), Number(limit), totalCount);
    return new PaginatedResponse(200, '보상 이력 조회 성공', items, meta);
  }

  @Get('/admin/rewards/history')
  @ApiOperation({ summary: '어드민 - 전체 보상 요청 이력 조회' })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: true,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    example: 20,
    required: true,
    description: '페이지당 항목 수',
  })
  @ApiQuery({
    name: 'userEmail',
    required: false,
    example: 'user@example.com',
    description: '유저 이메일로 필터링',
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    example: '66447c9ee6b84708fc26a842',
    description: '이벤트 ID로 필터링',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['SUCCESS', 'FAILURE'],
    description: '보상 요청 상태로 필터링',
  })
  async getAdminHistories(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userEmail') userEmail?: string,
    @Query('eventId') eventId?: string,
    @Query('status') status?: 'SUCCESS' | 'FAILURE',
  ): Promise<PaginatedResponse<RewardClaimHistory>> {
    const { totalCount, items } =
      await this.rewardService.getAdminHistoriesWithPage(
        { userEmail, eventId, status },
        page,
        limit,
      );
    const meta = new PaginationMeta(page, limit, totalCount);
    return new PaginatedResponse(
      200,
      '어드민 보상 이력 조회 성공',
      items,
      meta,
    );
  }
}
