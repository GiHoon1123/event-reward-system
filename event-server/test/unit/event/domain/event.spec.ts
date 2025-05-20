// test/unit/event/domain/event.spec.ts

import { NotEventCreatorException } from 'src/common/exception/custom/not-event-creator.exception';
import { Event } from 'src/event/domain/event';
import { Reward } from 'src/event/domain/reward';

describe('Event 도메인', () => {
  const creator = 'creator@example.com';
  const otherUser = 'hacker@example.com';

  describe('of', () => {
    it('정적 팩토리 메서드로 이벤트를 생성할 수 있다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);

      expect(event.title).toBe('제목');
      expect(event.description).toBe('설명');
      expect(event.condition.type).toBe('LOGIN_COUNT');
      expect(event.condition.value).toBe(3);
      expect(event.status).toBe('ACTIVE');
      expect(event.rewards).toEqual([]);
      expect(event.createdBy).toBe(creator);
    });
  });

  describe('isActive / isInActive', () => {
    it('status가 ACTIVE일 경우 isActive는 true여야 한다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);

      expect(event.isActive()).toBe(true);
      expect(event.isInActive()).toBe(false);
    });

    it('status가 INACTIVE일 경우 isInActive는 true여야 한다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);
      const inactive = event.markInactive(creator);

      expect(inactive.isActive()).toBe(false);
      expect(inactive.isInActive()).toBe(true);
    });
  });

  describe('addRewards', () => {
    it('이벤트 생성자만 보상을 추가할 수 있다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);
      const rewards: Reward[] = [
        Reward.create('포션', 100),
        Reward.create('골드', 500),
      ];

      event.addRewards(rewards, creator);

      expect(event.rewards).toHaveLength(2);
      expect(event.rewards[0].name).toBe('포션');
      expect(event.rewards[1].amount).toBe(500);
    });

    it('이벤트 생성자가 아닌 경우 보상 추가 시 예외가 발생한다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);
      const rewards: Reward[] = [Reward.create('포션', 100)];

      expect(() => event.addRewards(rewards, otherUser)).toThrow(
        NotEventCreatorException,
      );
    });
  });

  describe('markInactive / markActive', () => {
    it('이벤트 생성자만 비활성화할 수 있다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);
      const inactive = event.markInactive(creator);

      expect(inactive.status).toBe('INACTIVE');
      expect(inactive).not.toBe(event); // 불변성 확인 (새 인스턴스 반환)
    });

    it('이벤트 생성자가 아닌 경우 비활성화 시 예외가 발생한다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);

      expect(() => event.markInactive(otherUser)).toThrow(
        NotEventCreatorException,
      );
    });

    it('이벤트 생성자만 활성화할 수 있다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);
      const inactive = event.markInactive(creator);
      const activeAgain = inactive.markActive(creator);

      expect(activeAgain.status).toBe('ACTIVE');
      expect(activeAgain).not.toBe(inactive); // 새로운 인스턴스 반환
    });

    it('이벤트 생성자가 아닌 경우 활성화 시 예외가 발생한다', () => {
      const event = Event.of('제목', '설명', 'LOGIN_COUNT', 3, creator);

      expect(() => event.markActive(otherUser)).toThrow(
        NotEventCreatorException,
      );
    });
  });
});
