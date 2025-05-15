// src/user-event/web/dto/claim-reward.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class ClaimRewardRequestDto {
  @ApiProperty({ example: '극한성장의 비약' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsPositive()
  amount: number;
}
