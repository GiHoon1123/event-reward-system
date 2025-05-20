import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { PaginatedResponse } from 'src/common/dto/paginated-response.dto';

import { MongoIdValidationPipe } from 'src/common/pipe/mongo-id-validation.pipe';

import { EventDetailResponse } from '../application/dto/event-detail.response';
import { EventListResponse } from '../application/dto/event-list.response';
import { EventRewardResponse } from '../application/dto/event-rewards.response';
import { GetEventDetailQuery } from '../application/query/get-event-detail.query';
import { GetEventListQuery } from '../application/query/get-event-list.query';
import { GetEventRewardsQuery } from '../application/query/get-event-rewards.query';
import { EventService } from '../application/service/event.service';

@ApiTags('Public-Event')
@Controller('events')
export class PublicEventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: '이벤트 목록 조회' })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: true,
    description: '페이지 번호 (1부터 시작)',
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: true,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: '이벤트 목록 조회 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '이벤트 목록 조회 성공',
        data: [
          {
            id: '6826897559621cd773031bda',
            title: '3회 로그인 이벤트',
            description: '3번 로그인하면 아이템을 드립니다.',
            condition: {
              type: 'LOGIN_COUNT',
              value: 3,
            },
            status: 'INACTIVE',
            rewards: [
              {
                type: 'ITEM',
                name: '극한성장의 비약',
                amount: 100,
              },
              {
                type: 'ITEM',
                name: '코어 잼스톤',
                amount: 100,
              },
              {
                type: 'ITEM',
                name: '사우나 이용권',
                amount: 5,
              },
            ],
            createdBy: 'admin@example.com',
            createdAt: '2025-05-16T00:40:21.663Z',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
  })
  @Get()
  async getEvents(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<PaginatedResponse<EventListResponse>> {
    const query = new GetEventListQuery(page, limit);
    const result = await this.eventService.getAllEventsWithPage(query);
    return new PaginatedResponse(
      200,
      '이벤트 목록 조회 성공',
      result.items,
      result.meta,
    );
  }

  @Get(':eventId')
  @ApiParam({
    name: 'eventId',
    example: '6826897559621cd773031bda',
    description: '조회할 이벤트 ID',
  })
  @ApiOperation({
    summary: '이벤트 상세 조회',
    description: '이벤트의 상세 정보 및 보상 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '이벤트 상세 조회 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '이벤트 상세 조회 성공',
        data: {
          id: '6826897559621cd773031bda',
          title: '3회 로그인 이벤트',
          description: '3번 로그인하면 아이템을 드립니다.',
          conditionType: 'LOGIN_COUNT',
          conditionValue: 3,
          status: 'INACTIVE',
          createdBy: 'admin@example.com',
          rewards: [
            {
              type: 'ITEM',
              name: '극한성장의 비약',
              amount: 100,
            },
            {
              type: 'ITEM',
              name: '코어 잼스톤',
              amount: 100,
            },
            {
              type: 'ITEM',
              name: '사우나 이용권',
              amount: 5,
            },
          ],
        },
      },
    },
  })
  async getEventDetail(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
  ): Promise<CommonResponse<EventDetailResponse>> {
    const query = new GetEventDetailQuery(eventId);
    const result = await this.eventService.getEventDetail(query);
    return new CommonResponse(200, '이벤트 상세 조회 성공', result);
  }

  @Get(':eventId/rewards')
  @ApiOperation({ summary: '이벤트 보상 목록 조회' })
  @ApiParam({
    name: 'eventId',
    description: '조회할 이벤트 ID',
    example: '6826897559621cd773031bda',
  })
  @ApiResponse({
    status: 200,
    description: '이벤트에 연결된 보상 목록을 반환합니다.',
    schema: {
      example: {
        statusCode: 200,
        message: '이벤트 보상 목록 조회 성공',
        data: {
          eventId: '6826897559621cd773031bda',
          title: '3회 로그인 이벤트',
          rewards: [
            {
              name: '극한성장의 비약',
              type: 'ITEM',
              amount: 100,
            },
            {
              name: '코어 잼스톤',
              type: 'ITEM',
              amount: 100,
            },
            {
              name: '사우나 이용권',
              type: 'ITEM',
              amount: 5,
            },
          ],
        },
      },
    },
  })
  async getRewardsByEventId(
    @Param('eventId') eventId: string,
  ): Promise<CommonResponse<EventRewardResponse>> {
    const query = new GetEventRewardsQuery(eventId);
    const result = await this.eventService.getRewardsByEventId(query);
    return new CommonResponse(200, '이벤트 보상 목록 조회 성공', result);
  }
}
