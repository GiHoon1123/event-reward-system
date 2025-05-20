import { EventListResponse } from 'src/event/application/dto/event-list.response';
import { Reward } from 'src/event/domain/reward';

describe('EventListResponse', () => {
  it('이벤트 정보를 올바르게 매핑해야 한다', () => {
    const rewards: Reward[] = [
      { type: 'ITEM', name: '극한성장의 비약', amount: 100 },
      { type: 'ITEM', name: '코어 잼스톤', amount: 50 },
    ];

    const event = {
      id: 'abc123',
      title: '출석 이벤트',
      description: '매일 접속 시 보상을 드립니다.',
      status: 'INACTIVE' as const,
      createdBy: 'admin@example.com',
      rewards,
    };

    const dto = new EventListResponse(event);

    expect(dto.id).toBe(event.id);
    expect(dto.title).toBe(event.title);
    expect(dto.description).toBe(event.description);
    expect(dto.status).toBe(event.status);
    expect(dto.createdBy).toBe(event.createdBy);
    expect(dto.rewards).toEqual(event.rewards);
  });
});
