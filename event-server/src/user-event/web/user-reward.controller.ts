import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { MongoIdValidationPipe } from 'src/common/pipe/mongo-id-validation.pipe';
import { AvailableRewardResponse } from '../application/\bdto/available-reward.response';
import { RequestRewardCommand } from '../application/command/request-reward.command';
import { GetAvailableRewardsQuery } from '../application/query/get-available-rewards.query';
import { UserLoginEventRewardService } from '../application/service/user-login-event-reward.service';
import { ClaimRewardRequestDto } from './dto/claim-reward.request';

@ApiTags('User-Event')
@Controller('events')
export class UserRewardController {
  constructor(
    private readonly userLoginEventRewardService: UserLoginEventRewardService,
  ) {}

  @Post('users/rewards/:eventId')
  @ApiHeader({
    name: 'x-user-email',
    required: true,
    description: 'Gateway에서 전달된 사용자 이메일 (예: user@example.com)',
  })
  @ApiParam({
    name: 'eventId',
    required: true,
    example: '6826897559621cd773031bda',
    description: '보상을 요청할 이벤트 ID',
  })
  @ApiBody({
    type: ClaimRewardRequestDto,
    examples: {
      default: {
        summary: '보상 요청 예시',
        value: {
          requestId: '41b63bb2-4b82-417e-a731-0bbf35d2cd17',
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
  @ApiResponse({
    status: 201,
    description: '보상 요청 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '보상 요청이 성공 되었습니다.',
      },
    },
  })
  async requestReward(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Headers('x-user-email') email: string,
    @Body() rewards: ClaimRewardRequestDto,
  ): Promise<CommonResponse<void>> {
    const command = new RequestRewardCommand(
      eventId,
      email,
      rewards.requestId,
      {
        type: 'ITEM', // 현재 ITEM 고정이라면
        name: rewards.name,
        amount: rewards.amount,
      },
    );
    await this.userLoginEventRewardService.requestReward(command);

    return new CommonResponse(201, '보상 요청이 성공 되었습니다.');
  }

  @Get('users/rewards/:eventId/available')
  @ApiHeader({
    name: 'x-user-email',
    description: 'Gateway에서 전달된 사용자 이메일 (예: user@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    example: '6826897559621cd773031bda',
  })
  @ApiOperation({
    summary: '수령 가능 보상 목록 조회',
    description:
      '유저가 아직 수령하지 않은 보상 목록과 남은 개수를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '남은 보상 목록 조회 성공',
    schema: {
      example: {
        statusCode: 200,
        message: '남은 보상 목록 조회 성공',
        data: [
          {
            name: '극한성장의 비약',
            type: 'ITEM',
            availableAmount: 100,
          },
          {
            name: '코어 잼스톤',
            type: 'ITEM',
            availableAmount: 0,
          },
          {
            name: '사우나 이용권',
            type: 'ITEM',
            availableAmount: 5,
          },
        ],
      },
    },
  })
  async getAvailableRewards(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<AvailableRewardResponse[]>> {
    const query = new GetAvailableRewardsQuery(eventId, email);
    const result =
      await this.userLoginEventRewardService.getAvailableRewards(query);
    return new CommonResponse(200, '남은 보상 목록 조회 성공', result);
  }
}
