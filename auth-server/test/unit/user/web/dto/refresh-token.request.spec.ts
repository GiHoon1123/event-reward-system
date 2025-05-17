// test/unit/user/web/dto/refresh-token.request.spec.ts

import { validate } from 'class-validator';
import { RefreshTokenRequestDto } from 'src/user/web/dto/refresh-token.request';

describe('RefreshTokenRequestDto', () => {
  it('유효한 JWT 문자열이면 통과해야 한다', async () => {
    const dto = new RefreshTokenRequestDto();
    dto.refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('비어 있거나 JWT 형식이 아니면 에러가 발생해야 한다', async () => {
    const dto = new RefreshTokenRequestDto();
    dto.refreshToken = 'not-a-valid-token';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });

  it('문자열이 아니면 에러가 발생해야 한다', async () => {
    const dto = new RefreshTokenRequestDto();
    // @ts-expect-error: 타입 무시 테스트
    dto.refreshToken = 12345;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });
});
