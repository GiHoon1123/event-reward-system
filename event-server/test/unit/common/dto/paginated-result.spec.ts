import { PaginationMeta } from 'src/common/dto/paginated-response.dto';
import { PaginatedResult } from 'src/common/dto/paginated-result';

describe('PaginatedResult', () => {
  it('items와 meta를 올바르게 저장한다', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const meta = new PaginationMeta(1, 10, 20);

    const result = new PaginatedResult(items, meta);

    expect(result.items).toEqual(items);
    expect(result.meta).toEqual(meta);
  });

  it('중간 페이지일 때 totalPages, hasNext, hasPrevious 값을 계산한다', () => {
    const meta = new PaginationMeta(2, 10, 35);

    expect(meta.totalPages).toBe(4); // 35 / 10 => 올림하면 4페이지
    expect(meta.hasNext).toBe(true); // 2 < 4
    expect(meta.hasPrevious).toBe(true); // 2 > 1
  });

  it('첫 페이지일 때는 hasPrevious가 false여야 한다', () => {
    const meta = new PaginationMeta(1, 10, 30);

    expect(meta.totalPages).toBe(3);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrevious).toBe(false);
  });

  it('마지막 페이지일 때는 hasNext가 false여야 한다', () => {
    const meta = new PaginationMeta(3, 10, 30);

    expect(meta.totalPages).toBe(3);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrevious).toBe(true);
  });
});
