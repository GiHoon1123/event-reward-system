import { PaginationMeta } from 'src/common/dto/paginated-response.dto';

// 응용계층에서 표현계층으로 전달하는 dto
export class PaginatedResult<T> {
  constructor(
    public readonly items: T[],
    public readonly meta: PaginationMeta,
  ) {}
}
