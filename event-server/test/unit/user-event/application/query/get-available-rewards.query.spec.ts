import { GetAvailableRewardsQuery } from 'src/user-event/application/query/get-available-rewards.query';

describe('GetAvailableRewardsQuery', () => {
  it('eventId와 email을 올바르게 저장해야 한다', () => {
    const query = new GetAvailableRewardsQuery('event123', 'user@example.com');

    expect(query.eventId).toBe('event123');
    expect(query.email).toBe('user@example.com');
  });
});
