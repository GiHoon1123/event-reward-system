// src/user-event/web/reward-request.controller.ts

import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  PaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/paginated-response.dto';
import { UserRewardService } from '../application/service/user-reward.service';
import { RewardClaimHistory } from '../domain/reward-claim-history';

@ApiTags('Reward')
@Controller('rewards')
export class UserRewardHistoryController {
  constructor(private readonly userRewardService: UserRewardService) {}

  @Get('history/me')
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
  async getUserHistoriesWithPage(
    @Headers('x-user-email') email: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaginatedResponse<RewardClaimHistory>> {
    const { totalCount, items } =
      await this.userRewardService.getUserHistoriesWithPage(
        email,
        Number(page),
        Number(limit),
      );
    const meta = new PaginationMeta(Number(page), Number(limit), totalCount);
    return new PaginatedResponse(200, '보상 이력 조회 성공', items, meta);
  }

  @Get('/history')
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
  async getAHistoriesWithPage(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userEmail') userEmail?: string,
    @Query('eventId') eventId?: string,
    @Query('status') status?: 'SUCCESS' | 'FAILURE',
  ): Promise<PaginatedResponse<RewardClaimHistory>> {
    const { totalCount, items } =
      await this.userRewardService.getAHistoriesWithPage(
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
