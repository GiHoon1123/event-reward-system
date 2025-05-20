import { AddRewardsCommand } from 'src/event/application/command/add-rewards.command';

describe('AddRewardsCommand', () => {
  it('이벤트 ID, 보상 목록, 요청자 정보를 포함하여 생성되어야 한다', () => {
    const command = new AddRewardsCommand(
      'event123',
      [
        { name: '포션', amount: 100 },
        { name: '골드', amount: 500 },
      ],
      'creator@example.com',
    );

    expect(command.eventId).toBe('event123');
    expect(command.rewards).toHaveLength(2);
    expect(command.rewards[0]).toEqual({ name: '포션', amount: 100 });
    expect(command.rewards[1].name).toBe('골드');
    expect(command.requestedBy).toBe('creator@example.com');
  });
});
