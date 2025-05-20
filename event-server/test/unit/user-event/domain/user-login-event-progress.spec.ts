import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';

describe('UserLoginEventProgress 도메인', () => {
  const email = 'user@example.com';

  describe('createInitial()', () => {
    it('초기 생성 시 loginCount는 1이고 상태는 IN_PROGRESS여야 한다', () => {
      const progress = UserLoginEventProgress.createInitial(email);

      expect(progress.getLoginCount()).toBe(1);
      expect(progress.getStatus()).toBe('IN_PROGRESS');
      expect(progress.isCompleted()).toBe(false);
    });
  });

  describe('increase()', () => {
    it('로그인 횟수를 1 증가시킨다', () => {
      const progress = UserLoginEventProgress.createInitial(email);
      progress.increase();
      expect(progress.getLoginCount()).toBe(2);
    });
  });

  describe('markComplete()', () => {
    it('상태를 COMPLETED로 변경한다', () => {
      const progress = UserLoginEventProgress.createInitial(email);
      progress.markComplete();
      expect(progress.getStatus()).toBe('COMPLETED');
      expect(progress.isCompleted()).toBe(true);
    });
  });
});
