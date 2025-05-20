import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiPropertyOptional({ example: '요청이 성공적으로 처리되었습니다.' })
  message?: string;

  @ApiPropertyOptional({ description: '실제 반환 데이터' })
  data?: T;

  constructor(statusCode: number, message?: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
