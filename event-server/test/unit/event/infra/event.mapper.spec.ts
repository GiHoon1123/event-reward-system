import { Event } from 'src/event/domain/event';
import { Reward } from 'src/event/domain/reward';
import { EventEntity } from 'src/event/infra/event.entity';
import { EventMapper } from 'src/event/infra/event.mapper';

describe('EventMapper', () => {
  const creator = 'creator@example.com';
  const reward1 = Reward.create('포션', 100);
  const reward2 = Reward.create('코인', 200);
  const domain = Event.of('이벤트 제목', '설명', 'LOGIN_COUNT', 3, creator);

  domain.addRewards([reward1, reward2], creator);

  describe('toEntity()', () => {
    it('Event 도메인을 DB 저장용 객체로 변환해야 한다', () => {
      const entity = EventMapper.toEntity(domain);

      expect(entity.title).toBe('이벤트 제목');
      expect(entity.description).toBe('설명');
      expect(entity.status).toBe('ACTIVE');
      expect(entity.condition).toEqual({ type: 'LOGIN_COUNT', value: 3 });
      expect(entity.rewards).toHaveLength(2);
      expect(entity.rewards[0]).toEqual({
        type: 'ITEM',
        name: '포션',
        amount: 100,
      });
      expect(entity.createdBy).toBe(creator);
      expect(entity.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('toDomain()', () => {
    it('EventEntity를 도메인 객체로 변환해야 한다', () => {
      const now = new Date();

      const entity: Partial<EventEntity> = {
        _id: { toString: () => 'abc123' },
        title: '이벤트 제목',
        description: '설명',
        condition: { type: 'LOGIN_COUNT', value: 3 },
        status: 'ACTIVE',
        rewards: [
          { type: 'ITEM', name: '포션', amount: 100 },
          { type: 'ITEM', name: '코인', amount: 200 },
        ],
        createdBy: creator,
        createdAt: now,
      };

      const event = EventMapper.toDomain(entity as EventEntity);

      expect(event.id).toBe('abc123');
      expect(event.title).toBe('이벤트 제목');
      expect(event.description).toBe('설명');
      expect(event.status).toBe('ACTIVE');
      expect(event.condition).toEqual({ type: 'LOGIN_COUNT', value: 3 });
      expect(event.rewards).toHaveLength(2);
      expect(event.rewards[0]).toBeInstanceOf(Reward);
      expect(event.rewards[0].name).toBe('포션');
      expect(event.createdBy).toBe(creator);
      expect(event.createdAt).toBe(now);
    });
  });
});
