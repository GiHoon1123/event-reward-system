import { GetEventListQuery } from 'src/event/application/query/get-event-list.query';

describe('FindEventListQuery', () => {
  it('페이지 번호와 페이지당 항목 수를 포함하여 생성되어야 한다', () => {
    const query = new GetEventListQuery(2, 20);

    expect(query.page).toBe(2);
    expect(query.limit).toBe(20);
  });
});
