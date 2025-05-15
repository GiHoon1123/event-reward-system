import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
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
import { AddRewardsCommand } from 'src/event/application/command/add-rewards.command';
import { CreateEventCommand } from 'src/event/application/command/create-event.command';

import { EventService } from '../application/service/\bevent.service';
import { CreateEventRequestDto } from './dto/create-event.request';
import { EventDetailResponseDto } from './dto/event-detail.response';
import { EventListResponseDto } from './dto/event-list.response';
import { RewardRequestDto } from './dto/reward.request';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: admin@example.com)',
  })
  @ApiOperation({
    summary: '이벤트 등록',
    description: `
**운영자 또는 관리자만 사용할 수 있습니다.**  
이벤트 조건, 기간, 설명 등을 등록합니다.  

- 현재 조건은 \`LOGIN_COUNT\`로 고정되어 있습니다.  
- 보상은 별도 API로 등록합니다.  

\`/events/:eventId/rewards\`를 참조하세요.
    `,
  })
  async createEvent(
    @Body() dto: CreateEventRequestDto,
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new CreateEventCommand(
      dto.title,
      dto.description,
      dto.conditionValue,
      email,
    );
    await this.eventService.createEvent(command);
    return new CommonResponse(201, '이벤트가 성공적으로 등록되었습니다.');
  }

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

  @Post(':eventId/rewards')
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: admin@example.com)',
  })
  @ApiParam({
    name: 'eventId',
    description: '보상을 추가할 이벤트 ID',
    example: '68253391f243bc0bb1165f0b',
  })
  @ApiBody({
    type: [RewardRequestDto],
    description: '등록할 보상 목록',
    examples: {
      default: {
        summary: '보상 예시',
        value: [
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
  })
  @ApiOperation({
    summary: '이벤트 보상 등록',
    description: `
**해당 이벤트의 생성자만 호출할 수 있습니다.**  
보상은 \`ITEM\` 타입으로 고정되어 있으며, 여러 개 등록 가능합니다.

※ 다른 사용자가 요청하면 403 에러 발생
    `,
  })
  async addRewards(
    @Param('eventId') eventId: string,
    @Body() rewards: RewardRequestDto[],
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new AddRewardsCommand(eventId, rewards, email);
    await this.eventService.addRewards(command);
    return new CommonResponse(201, '보상이 성공적으로 등록되었습니다.');
  }
}
