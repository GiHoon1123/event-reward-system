import { ApiProperty } from '@nestjs/swagger';

export class RewardClaimLogResponse {
  @ApiProperty({
    example: '6647b865f8a4e95222c9fcab',
    description: '이벤트 ID',
  })
  eventId: string;

  @ApiProperty({ example: 'user@example.com', description: '유저 이메일' })
  email: string;

  @ApiProperty({ example: '100포션', description: '보상 이름' })
  rewardName: string;

  @ApiProperty({ example: 3, description: '보상 수량' })
  amount: number;

  @ApiProperty({ example: 'SUCCESS', description: '상태 (SUCCESS | FAILURE)' })
  status: 'SUCCESS' | 'FAILURE';

  @ApiProperty({
    example: '중복 요청입니다.',
    description: '실패 사유',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    example: '2025-05-19T12:34:56.000Z',
    description: '요청 일시',
  })
  claimedAt: Date;

  constructor(entity: any) {
    this.eventId = entity.eventId;
    this.email = entity.email;
    this.rewardName = entity.rewardName;
    this.amount = entity.amount;
    this.status = entity.status;
    this.reason = entity.reason;
    this.claimedAt = entity.claimedAt;
  }
}
