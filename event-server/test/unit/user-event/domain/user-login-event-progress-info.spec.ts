import { UserLoginEventProgressInfo } from 'src/user-event/domain/user-login-event-progress-info';

describe('UserLoginEventProgressInfo 도메인', () => {
  describe('isSatisfied()', () => {
    it('current가 required보다 작으면 false를 반환한다', () => {
      const progress = new UserLoginEventProgressInfo('event123', 2, 3);
      expect(progress.isSatisfied()).toBe(false);
    });

    it('current가 required와 같으면 true를 반환한다', () => {
      const progress = new UserLoginEventProgressInfo('event123', 3, 3);
      expect(progress.isSatisfied()).toBe(true);
    });

    it('current가 required보다 크면 true를 반환한다', () => {
      const progress = new UserLoginEventProgressInfo('event123', 5, 3);
      expect(progress.isSatisfied()).toBe(true);
    });
  });

  describe('getRate()', () => {
    it('달성률을 백분율로 계산한다 (소수점 내림)', () => {
      const progress = new UserLoginEventProgressInfo('event123', 1, 3);
      expect(progress.getRate()).toBe(33); // 1/3 = 0.333 → 33%
    });

    it('달성률이 100%를 초과해도 최대 100으로 제한한다', () => {
      const progress = new UserLoginEventProgressInfo('event123', 10, 3);
      expect(progress.getRate()).toBe(100); // 10/3 = 333% → 최대 100
    });

    it('정확히 100%인 경우도 정상 처리한다', () => {
      const progress = new UserLoginEventProgressInfo('event123', 3, 3);
      expect(progress.getRate()).toBe(100);
    });
  });
});
