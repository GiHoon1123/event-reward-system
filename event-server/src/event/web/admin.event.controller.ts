import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { AddRewardsCommand } from 'src/event/application/command/add-rewards.command';
import { CreateEventCommand } from 'src/event/application/command/create-event.command';

import { MongoIdValidationPipe } from 'src/common/pipe/mongo-id-validation.pipe';

import { EventStatusChangeCommand } from '../application/command/event-status-chagne-command';
import { EventService } from '../application/service/event.service';
import { ChangeEventStatusRequestDto } from './dto/change-event-status.request';
import { CreateEventRequestDto } from './dto/create-event.request';
import { EventRewardRequestDto } from './dto/event-reward.request';

@ApiTags('Admin-Event')
@Controller('admin/events')
export class AdminEventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: admin@example.com)',
  })
  @ApiOperation({
    summary: '이벤트 등록',
    description: `**운영자 또는 관리자만 사용할 수 있습니다(ADMIN,OPERATOR)**  
이벤트 조건, 기간, 설명 등을 등록합니다.  

- 현재 조건은 LOGIN_COUNT 로 고정되어 있습니다.  
- 보상은 별도 API로 등록합니다. (admin/events/:eventId/rewards 를 참조하세요.`,
  })
  @ApiResponse({
    status: 201,
    description: '이벤트 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '이벤트가 성공적으로 등록되었습니다.',
      },
    },
  })
  async createEvent(
    @Body() dto: CreateEventRequestDto,
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new CreateEventCommand(
      dto.title,
      dto.description,
      dto.conditionType,
      dto.conditionValue,
      email,
    );
    await this.eventService.createEvent(command);
    return new CommonResponse(201, '이벤트가 성공적으로 등록되었습니다.');
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
    example: '6826897559621cd773031bda',
  })
  @ApiBody({
    type: [EventRewardRequestDto],
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
    description: `**해당 이벤트의 생성자만 호출할 수 있습니다.**  
보상은 ITEM 타입으로 고정되어 있으며, 여러 개 등록 가능합니다.`,
  })
  @ApiResponse({
    status: 201,
    description: '보상 등록 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '보상이 성공적으로 등록되었습니다.',
      },
    },
  })
  async addRewards(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Body() rewards: EventRewardRequestDto[],
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new AddRewardsCommand(eventId, rewards, email);
    await this.eventService.addRewards(command);
    return new CommonResponse(201, '보상이 성공적으로 등록되었습니다.');
  }

  @Post(':eventId/status')
  @ApiHeader({
    name: 'x-user-email',
    description: 'Gateway에서 전달된 사용자 이메일 (예: admin@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '상태를 변경할 이벤트 ID',
    example: '6826897559621cd773031bda',
  })
  @ApiBody({
    schema: {
      example: {
        status: 'INACTIVE',
      },
    },
  })
  @ApiOperation({
    summary: '이벤트 상태 변경',
    description: `이벤트 상태를 'ACTIVE' 또는 'INACTIVE'로 변경합니다.  
**해당 이벤트의 생성자만 호출할 수 있습니다.**  
상태값은 다음 두 가지만 허용됩니다:  
- 'ACTIVE'  
- 'INACTIVE'`,
  })
  @ApiResponse({
    status: 200,
    description: '상태 변경 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '이벤트 상태가 INACTIVE로 변경되었습니다.',
      },
    },
  })
  async changeStatus(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Headers('x-user-email') email: string,
    @Body() dto: ChangeEventStatusRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new EventStatusChangeCommand(eventId, dto.status, email);
    await this.eventService.changeStatus(command);
    return new CommonResponse(
      200,
      `이벤트 상태가 ${dto.status}로 변경되었습니다.`,
    );
  }
}
