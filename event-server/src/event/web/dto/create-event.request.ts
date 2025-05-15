import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class CreateEventRequestDto {
  @ApiProperty({ example: '3회 로그인 이벤트' })
  @IsString()
  title: string;

  @ApiProperty({ example: '3번 로그인하면 아이템을 드립니다.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 3, description: '이벤트 조건 값 (로그인 횟수)' })
  @IsNumber()
  @Min(1)
  conditionValue: number;

  @ApiProperty({ example: '2025-05-15T00:00:00Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2025-06-01T23:59:59Z' })
  @IsDateString()
  endAt: string;
}
