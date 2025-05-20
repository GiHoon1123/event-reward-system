import { RequestRewardCommand } from 'src/user-event/application/command/request-reward.command';

describe('RequestRewardCommand', () => {
  it('모든 필드가 정확히 설정되어야 한다', () => {
    const command = new RequestRewardCommand(
      'event123',
      'user@example.com',
      'request-uuid-001',
      {
        type: 'ITEM',
        name: '극한성장의 비약',
        amount: 100,
      },
    );

    expect(command.eventId).toBe('event123');
    expect(command.email).toBe('user@example.com');
    expect(command.requestId).toBe('request-uuid-001');
    expect(command.rewardToClaim).toEqual({
      type: 'ITEM',
      name: '극한성장의 비약',
      amount: 100,
    });
  });
});
