import {
  RewardItem,
  EventRewardResponse,
} from 'src/event/application/dto/event-rewards.response';

describe('EventRewardResponse', () => {
  it('이벤트 보상 응답 객체를 올바르게 생성해야 한다', () => {
    const rewards: RewardItem[] = [
      new RewardItem({ name: '극한성장의 비약', type: 'ITEM', amount: 100 }),
      new RewardItem({ name: '코어 잼스톤', type: 'ITEM', amount: 50 }),
    ];

    const event = {
      eventId: 'abc123',
      title: '보상 이벤트',
      rewards,
    };

    const dto = new EventRewardResponse(event);

    expect(dto.eventId).toBe(event.eventId);
    expect(dto.title).toBe(event.title);
    expect(dto.rewards).toEqual(rewards);
  });
});

describe('RewardItem', () => {
  it('보상 아이템을 올바르게 생성해야 한다', () => {
    const reward = new RewardItem({
      name: '사우나 이용권',
      type: 'ITEM',
      amount: 5,
    });

    expect(reward.name).toBe('사우나 이용권');
    expect(reward.type).toBe('ITEM');
    expect(reward.amount).toBe(5);
  });
});
