import { ApiProperty } from '@nestjs/swagger';

export class AvailableRewardResponse {
  @ApiProperty({
    example: '극한성장의 비약',
    description: '보상 이름',
  })
  name: string;

  @ApiProperty({
    example: 'ITEM',
    description: '보상 타입 (예: ITEM, CURRENCY 등)',
  })
  type: string;

  @ApiProperty({
    example: 2,
    description: '사용자가 수령 가능한 수량',
  })
  availableAmount: number;

  constructor(name: string, type: string, availableAmount: number) {
    this.name = name;
    this.type = type;
    this.availableAmount = availableAmount;
  }
}
