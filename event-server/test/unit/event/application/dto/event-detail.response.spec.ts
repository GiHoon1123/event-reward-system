import { EventDetailResponse } from 'src/event/application/dto/event-detail.response';
import { Reward } from 'src/event/domain/reward';

describe('EventDetailResponse', () => {
  it('이벤트 정보를 올바르게 매핑해야 한다', () => {
    const rewards: Reward[] = [
      { type: 'ITEM', name: '극한성장의 비약', amount: 100 },
      { type: 'ITEM', name: '코어 잼스톤', amount: 50 },
    ];

    const event = {
      id: '123',
      title: '로그인 보상 이벤트',
      description: '3번 로그인하면 보상을 드립니다.',
      condition: {
        type: 'LOGIN_COUNT' as const, // <-- 여기를 string이 아닌 리터럴로 지정
        value: 3,
      },
      status: 'ACTIVE' as const,
      createdBy: 'admin@example.com',
      rewards,
    };

    const dto = new EventDetailResponse(event);

    expect(dto.id).toBe(event.id);
    expect(dto.title).toBe(event.title);
    expect(dto.description).toBe(event.description);
    expect(dto.conditionType).toBe(event.condition.type);
    expect(dto.conditionValue).toBe(event.condition.value);
    expect(dto.status).toBe(event.status);
    expect(dto.createdBy).toBe(event.createdBy);
    expect(dto.rewards).toEqual(event.rewards);
  });
});
