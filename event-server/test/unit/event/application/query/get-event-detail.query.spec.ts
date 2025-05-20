import { GetEventDetailQuery } from 'src/event/application/query/get-event-detail.query';

describe('GetEventDetailQuery', () => {
  it('eventId 값을 올바르게 저장해야 한다', () => {
    const query = new GetEventDetailQuery('abc123');

    expect(query.eventId).toBe('abc123');
  });
});
