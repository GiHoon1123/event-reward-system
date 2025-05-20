import { GetProgressInfoQuery } from 'src/user-event/application/query/get-progress-info-query';

describe('GetProgressInfoQuery', () => {
  it('eventId와 email을 올바르게 저장해야 한다', () => {
    const query = new GetProgressInfoQuery('event123', 'user@example.com');

    expect(query.eventId).toBe('event123');
    expect(query.email).toBe('user@example.com');
  });
});
