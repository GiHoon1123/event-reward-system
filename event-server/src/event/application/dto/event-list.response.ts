import { ApiProperty } from '@nestjs/swagger';
import { Reward } from 'src/event/domain/reward';

export class EventListResponse {
  @ApiProperty({ example: '68253391f243bc0bb1165f0b' })
  id: string;

  @ApiProperty({ example: '3회 로그인 이벤트' })
  title: string;

  @ApiProperty({ example: '3번 로그인하면 아이템을 드립니다.' })
  description: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ example: 'admin@example.com' })
  createdBy: string;

  @ApiProperty({
    example: [
      { type: 'ITEM', name: '극한성장의 비약', amount: 100 },
      { type: 'ITEM', name: '코어 잼스톤', amount: 100 },
    ],
  })
  rewards: Reward[];

  constructor(event: {
    id: string;
    title: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdBy: string;
    rewards: Reward[];
  }) {
    Object.assign(this, event);
  }
}
