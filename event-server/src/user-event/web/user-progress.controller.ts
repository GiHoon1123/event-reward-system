import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { MongoIdValidationPipe } from 'src/common/pipe/mongo-id-validation.pipe';
import { UserLoginEventProgressInfoResponse } from '../application/\bdto/user-login-event-progress-info.response';
import { CompleteLoginEventCommand } from '../application/command/complete-login-event.command';
import { IncreaseLoginCountCommand } from '../application/command/increase-login-count.command';
import { GetProgressInfoQuery } from '../application/query/get-progress-info-query';
import { UserLoginEventProgressService } from '../application/service/user-login-event-progress.service';

@ApiTags('Event-Progress')
@Controller('events')
export class UserProgressController {
  constructor(
    private readonly userLoginEventProgressService: UserLoginEventProgressService,
  ) {}

  @Post('/users/progress/login')
  @ApiHeader({
    name: 'x-user-email',
    description: '로그인한 유저의 이메일 (예: user@example.com)',
    required: true,
  })
  @ApiOperation({
    summary: '이벤트 진행도 증가',
    description:
      '로그인 성공 시 호출되며, 해당 유저의 로그인 이벤트 참여 횟수를 1 증가시킵니다.',
  })
  @ApiResponse({
    status: 201,
    description: '진행도 증가 성공',
    schema: {
      example: {
        statusCode: 201,
        message: '유저의 로그인 이벤트 진행도가 증가했습니다.',
      },
    },
  })
  async increaseLoginCount(
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new IncreaseLoginCountCommand(email);
    await this.userLoginEventProgressService.increaseLoginCount(command);
    return new CommonResponse(
      201,
      '유저의 로그인 이벤트 진행도가 증가했습니다.',
    );
  }

  @Get('/users/progress/:eventId')
  @ApiHeader({
    name: 'x-user-email',
    description: '요청 유저 이메일 (예: user@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '진행도를 확인할 이벤트 ID',
    example: '6826897559621cd773031bda',
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
    schema: {
      example: {
        statusCode: 200,
        message: '이벤트 진행도 조회 성공',
        data: {
          eventId: '6826897559621cd773031bda',
          current: 1,
          required: 3,
          met: false,
          rate: 33,
        },
      },
    },
  })
  async getProgress(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<UserLoginEventProgressInfoResponse>> {
    const query = new GetProgressInfoQuery(eventId, email);
    const result =
      await this.userLoginEventProgressService.getProgressInfo(query);
    return new CommonResponse(200, '이벤트 진행도 조회 성공', result);
  }

  @ApiOperation({ summary: '이벤트 완료 처리' })
  @Post('/users/progress/:eventId/complete')
  @ApiHeader({
    name: 'x-user-email',
    description: '요청 유저 이메일 (예 user@example.com)',
    required: true,
  })
  @ApiParam({
    name: 'eventId',
    description: '진행도를 확인할 이벤트 ID',
    example: '6826897559621cd773031bda',
  })
  @ApiOperation({
    summary: '이벤트 완료 처리',
    description: `
이벤트 참여 요건을 만족한 후, 이벤트 완료 처리를 진행합니다. 완료된 이후에는 보상을 수령할 수 있습니다.  
    `,
  })
  @ApiResponse({
    status: 200,
    description: '이벤트가 완료 처리되었습니다.',
    schema: {
      example: {
        statusCode: 201,
        message: '이벤트가 완료 처리되었습니다.',
      },
    },
  })
  async completeEvent(
    @Param('eventId', MongoIdValidationPipe) eventId: string,
    @Headers('x-user-email') email: string,
  ): Promise<CommonResponse<void>> {
    const command = new CompleteLoginEventCommand(eventId, email);
    await this.userLoginEventProgressService.markAsComplete(command);
    return new CommonResponse(200, '이벤트가 완료 처리되었습니다.');
  }
}
