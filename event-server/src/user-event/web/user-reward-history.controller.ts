import { Controller, Get, Headers, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/paginated-response.dto';
import { UserRewardService } from '../application/service/user-reward.service';
import { RewardClaimHistory } from '../domain/reward-claim-history';

@ApiTags('Reward')
@Controller('events')
export class UserRewardHistoryController {
  constructor(private readonly userRewardService: UserRewardService) {}
  @Get('rewards/history/me')
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
  @ApiResponse({
    status: 200,
    description: '보상 이력 조회 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '보상 이력 조회 성공',
        data: [
          {
            eventId: '6826897559621cd773031bda',
            email: 'user@example.com',
            rewardName: '코어 잼스톤',
            amount: 100,
            status: 'SUCCESS',
            claimedAt: '2025-05-16T01:55:17.268Z',
          },
          {
            eventId: '6826897559621cd773031bda',
            email: 'user@example.com',
            rewardName: '코어 잼스톤',
            amount: 100,
            status: 'FAILURE',
            claimedAt: '2025-05-16T01:53:24.338Z',
            reason: '이벤트 미 완료 ',
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          totalCount: 3,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
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

  @Get('rewards/history')
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
  @ApiResponse({
    status: 200,
    description: '어드민 보상 이력 조회 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '어드민 보상 이력 조회 성공',
        data: [
          {
            eventId: '6826897559621cd773031bda',
            email: 'user@example.com',
            rewardName: '코어 잼스톤',
            amount: 100,
            status: 'SUCCESS',
            claimedAt: '2025-05-16T01:55:17.268Z',
          },
          {
            eventId: '6826897559621cd773031bda',
            email: 'user@example.com',
            rewardName: '코어 잼스톤',
            amount: 100,
            status: 'FAILURE',
            claimedAt: '2025-05-16T01:53:24.338Z',
            reason: '이벤트 미 완료 ',
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          totalCount: 3,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
  })
  async getAHistoriesWithPage(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaginatedResponse<RewardClaimHistory>> {
    const { totalCount, items } =
      await this.userRewardService.getHistoriesWithPage(
        Number(page),
        Number(limit),
      );
    const meta = new PaginationMeta(Number(page), Number(limit), totalCount);
    return new PaginatedResponse(
      200,
      '어드민 보상 이력 조회 성공',
      items,
      meta,
    );
  }
}
