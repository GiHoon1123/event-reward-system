import { ApiProperty } from '@nestjs/swagger';

export class UserLoginEventProgressInfoResponse {
  @ApiProperty({
    example: '9e4f5d83-10ab-4567-9371-1d6f7cf3c123',
    description: '이벤트 ID',
  })
  eventId: string;

  @ApiProperty({
    example: 2,
    description: '현재 로그인 횟수',
  })
  currentLoginCount: number;

  @ApiProperty({
    example: 3,
    description: '이벤트 완료 조건 (필요 로그인 횟수)',
  })
  requiredLoginCount: number;

  constructor(
    eventId: string,
    currentLoginCount: number,
    requiredLoginCount: number,
  ) {
    this.eventId = eventId;
    this.currentLoginCount = currentLoginCount;
    this.requiredLoginCount = requiredLoginCount;
  }
}
