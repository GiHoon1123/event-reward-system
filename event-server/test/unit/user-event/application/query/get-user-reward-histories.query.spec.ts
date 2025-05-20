import { GetUserRewardHistoriesQuery } from 'src/user-event/application/query/get-user-reward-histories.query';

describe('GetUserRewardHistoriesQuery', () => {
  it('email, page, limit을 올바르게 저장해야 한다', () => {
    const query = new GetUserRewardHistoriesQuery('user@example.com', 1, 20);

    expect(query.email).toBe('user@example.com');
    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
  });
});
