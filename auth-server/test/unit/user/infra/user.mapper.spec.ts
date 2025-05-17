import { Role, User } from 'src/user/domain/user';
import { UserMapper } from 'src/user/infra/user.mapper';

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('UserEntity를 User 도메인 객체로 변환해야 한다', () => {
      const mockEntity = {
        _id: { toString: () => 'abc123' },
        email: 'test@example.com',
        password: 'hashed',
        role: Role.USER,
        refreshToken: 'ref-token',
      };

      const result = UserMapper.toDomain(mockEntity as any);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('abc123');
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('hashed');
      expect(result.role).toBe(Role.USER);
      expect(result.refreshToken).toBe('ref-token');
    });
  });

  describe('toEntity', () => {
    it('User 도메인 객체를 UserEntity 형태로 변환해야 한다', () => {
      const user = User.toDomain(
        'abc123',
        'test@example.com',
        'hashed',
        Role.ADMIN,
        null,
      );

      const result = UserMapper.toEntity(user);

      expect(result).toEqual({
        email: 'test@example.com',
        password: 'hashed',
        role: Role.ADMIN,
        refreshToken: null,
      });
    });
  });
});
