// test/unit/user/domain/user.spec.ts

import { InvalidRoleException } from 'src/common/exception/custom/invalid-role.exception';
import { User, Role } from 'src/user/domain/user';

describe('User 도메인', () => {
  describe('User.of', () => {
    it('기본값을 포함한 유저를 생성해야 한다', () => {
      const user = User.of('test@example.com', 'hashed-password');

      expect(user.id).toBeNull();
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashed-password');
      expect(user.role).toBe(Role.USER);
      expect(user.refreshToken).toBeNull();
    });
  });

  describe('User.toDomain', () => {
    it('모든 속성으로 유저를 생성해야 한다', () => {
      const user = User.toDomain(
        'user-id',
        'admin@example.com',
        'hashed-password',
        Role.ADMIN,
        'refresh-token-xyz',
      );

      expect(user.id).toBe('user-id');
      expect(user.email).toBe('admin@example.com');
      expect(user.password).toBe('hashed-password');
      expect(user.role).toBe(Role.ADMIN);
      expect(user.refreshToken).toBe('refresh-token-xyz');
    });
  });

  describe('changeRole', () => {
    it('유효한 역할로 변경할 수 있어야 한다', () => {
      const user = User.of('test@example.com', 'pass');
      user.changeRole(Role.OPERATOR);

      expect(user.role).toBe(Role.OPERATOR);
    });

    it('유효하지 않은 역할이면 InvalidRoleException이 발생해야 한다', () => {
      const user = User.of('test@example.com', 'pass');

      // @ts-expect-error: 타입은 맞지 않지만 런타임 체크 테스트
      expect(() => user.changeRole('INVALID_ROLE')).toThrow(
        InvalidRoleException,
      );
    });
  });
});
