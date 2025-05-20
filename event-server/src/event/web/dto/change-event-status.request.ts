import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ChangeEventStatusRequestDto {
  @ApiProperty({
    example: 'INACTIVE',
    description: "이벤트 상태 ('ACTIVE' 또는 'INACTIVE')",
  })
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'status는 ACTIVE 또는 INACTIVE 중 하나여야 합니다.',
  })
  status: 'ACTIVE' | 'INACTIVE';
}
