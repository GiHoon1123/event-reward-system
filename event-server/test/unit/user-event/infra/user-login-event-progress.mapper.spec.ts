import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';
import { UserLoginEventProgressEntity } from 'src/user-event/infra/user-login-event-progress.entity';
import { UserLoginEventProgressMapper } from 'src/user-event/infra/user-login-event-progress.mapper';

describe('UserLoginEventProgressMapper', () => {
  const email = 'user@example.com';

  describe('toEntity', () => {
    it('도메인 → entity 변환 시 필드가 정확히 매핑되어야 한다', () => {
      const domain = new UserLoginEventProgress(email, 5, 'COMPLETED');

      const entity = UserLoginEventProgressMapper.toEntity(domain);

      expect(entity.email).toBe(email);
      expect(entity.loginCount).toBe(5);
      expect(entity.status).toBe('COMPLETED');
    });
  });

  describe('toDomain', () => {
    it('entity → 도메인 변환 시 도메인 객체가 생성되어야 한다', () => {
      const entity = {
        email,
        loginCount: 3,
        status: 'IN_PROGRESS',
      } as UserLoginEventProgressEntity;

      const domain = UserLoginEventProgressMapper.toDomain(entity);

      expect(domain).toBeInstanceOf(UserLoginEventProgress);
      expect(domain.email).toBe(email);
      expect(domain.getLoginCount()).toBe(3);
      expect(domain.getStatus()).toBe('IN_PROGRESS');
    });
  });
});
