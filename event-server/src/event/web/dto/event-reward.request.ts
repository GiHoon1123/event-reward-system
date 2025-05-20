import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class EventRewardRequestDto {
  @ApiProperty({ example: 'ITEM', enum: ['ITEM'] })
  @IsEnum(['ITEM'])
  type: 'ITEM';

  @ApiProperty({ example: '극한성장의 비약' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  amount: number;
}
