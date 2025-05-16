import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

export class ClaimRewardRequestDto {
  @ApiProperty({ example: '극한성장의 비약' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: '41b63bb2-4b82-417e-a731-0bbf35d2cd17',
    description: '멱등성을 위한 UUID',
  })
  @IsUUID()
  requestId: string;
}
