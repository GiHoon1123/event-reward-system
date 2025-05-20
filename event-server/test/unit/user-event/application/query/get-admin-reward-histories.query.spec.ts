import { GetAdminRewardHistoriesQuery } from 'src/user-event/application/query/get-admin-reward-histories.query';

describe('GetAdminRewardHistoriesQuery', () => {
  it('페이지와 페이지당 항목 수를 올바르게 저장해야 한다', () => {
    const query = new GetAdminRewardHistoriesQuery(2, 20);

    expect(query.page).toBe(2);
    expect(query.limit).toBe(20);
  });
});
