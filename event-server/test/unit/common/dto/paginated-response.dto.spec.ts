import {
  PaginatedResponse,
  PaginationMeta,
} from 'src/common/dto/paginated-response.dto';

describe('PaginationMeta', () => {
  it('전체 개수와 페이지당 항목 수를 기반으로 총 페이지 수, 다음/이전 페이지 존재 여부를 계산할 수 있다', () => {
    const meta = new PaginationMeta(2, 10, 45); // 현재 페이지: 2, 전체 개수: 45

    expect(meta.page).toBe(2);
    expect(meta.limit).toBe(10);
    expect(meta.totalCount).toBe(45);
    expect(meta.totalPages).toBe(5); // 45 / 10 = 4.5 → 올림 = 5
    expect(meta.hasNext).toBe(true); // 현재 페이지 2 < 총 페이지 5
    expect(meta.hasPrevious).toBe(true); // 현재 페이지 2 > 1
  });

  it('마지막 페이지일 경우 hasNext는 false가 되어야 한다', () => {
    const meta = new PaginationMeta(5, 10, 50); // 마지막 페이지

    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrevious).toBe(true);
  });

  it('첫 페이지일 경우 hasPrevious는 false가 되어야 한다', () => {
    const meta = new PaginationMeta(1, 10, 50); // 첫 페이지

    expect(meta.hasPrevious).toBe(false);
    expect(meta.hasNext).toBe(true);
  });
});

describe('PaginatedResponse', () => {
  it('데이터 목록과 페이지 정보가 함께 포함된 응답 객체를 생성할 수 있다', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const meta = new PaginationMeta(1, 10, 20);
    const response = new PaginatedResponse(200, '조회 성공', data, meta);

    expect(response.statusCode).toBe(200);
    expect(response.message).toBe('조회 성공');
    expect(response.data).toEqual(data);
    expect(response.meta).toBeInstanceOf(PaginationMeta);
    expect(response.meta.totalPages).toBe(2);
  });
});
