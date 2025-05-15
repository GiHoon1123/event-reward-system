import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 1, description: '현재 페이지 번호 (1부터 시작)' })
  page: number;

  @ApiProperty({ example: 10, description: '페이지당 항목 수' })
  limit: number;

  @ApiProperty({ example: 48, description: '전체 문서 개수' })
  totalCount: number;

  @ApiProperty({ example: 5, description: '총 페이지 수' })
  totalPages: number;

  @ApiProperty({ example: true, description: '다음 페이지 존재 여부' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: '이전 페이지 존재 여부' })
  hasPrevious: boolean;

  constructor(page: number, limit: number, totalCount: number) {
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
    this.totalPages = Math.ceil(totalCount / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrevious = page > 1;
  }
}

export class PaginatedResponse<T> {
  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ example: '조회 성공' })
  message?: string;

  @ApiProperty({ description: '조회된 데이터 목록' })
  data: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;

  constructor(
    statusCode: number,
    message: string,
    data: T[],
    meta: PaginationMeta,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
