import { GetEventRewardsQuery } from 'src/event/application/query/get-event-rewards.query';

describe('GetEventRewardsQuery', () => {
  it('eventId 값을 올바르게 저장해야 한다', () => {
    const query = new GetEventRewardsQuery('event123');

    expect(query.eventId).toBe('event123');
  });
});
