import { JwtStrategy } from 'src/auth/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'; // ✅ secret 설정
  });

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('validate()는 payload에서 email과 role을 꺼내 반환해야 한다', async () => {
    // 🔹 가짜 JWT payload
    const payload = {
      sub: 'some-user-id',
      email: 'user@example.com',
      role: 'USER',
      iat: 1234567890,
      exp: 1234569999,
    };

    // 🔍 validate 함수 호출
    const result = await strategy.validate(payload);

    // ✅ email과 role만 반환해야 한다
    expect(result).toEqual({
      email: 'user@example.com',
      role: 'USER',
    });
  });
});
