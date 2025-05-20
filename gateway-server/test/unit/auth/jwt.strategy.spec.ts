import { JwtStrategy } from '../../../src/auth/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeAll(() => {
    // ✅ 환경변수 설정
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('validate()는 payload에서 email과 role을 꺼내서 roles 배열로 반환해야 한다', async () => {
    const payload = {
      email: 'user@example.com',
      role: 'USER',
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      email: 'user@example.com',
      roles: ['USER'],
    });
  });
});
