import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import {
  PaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/paginated-response.dto';

import { EventService } from '../application/service/\bevent.service';
import { EventDetailResponseDto } from './dto/event-detail.response';
import { EventListResponseDto } from './dto/event-list.response';

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
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<PaginatedResponse<EventListResponseDto>> {
    const { totalCount, items } = await this.eventService.findAllWithPage(
      page,
      limit,
    );
    const dto = items.map((e) => new EventListResponseDto(e));
    return new PaginatedResponse(
      200,
      '이벤트 목록 조회 성공',
      dto,
      new PaginationMeta(page, limit, totalCount),
    );
  }

  @Get(':eventId')
  @ApiParam({
    name: 'eventId',
    example: '68253391f243bc0bb1165f0b',
    description: '조회할 이벤트 ID',
  })
  @ApiOperation({
    summary: '이벤트 상세 조회',
    description: '이벤트의 상세 정보 및 보상 목록을 조회합니다.',
  })
  async findById(
    @Param('eventId') eventId: string,
  ): Promise<CommonResponse<EventDetailResponseDto>> {
    const event = await this.eventService.findById(eventId);
    return new CommonResponse(
      200,
      '이벤트 상세 조회 성공',
      new EventDetailResponseDto(event),
    );
  }
}
