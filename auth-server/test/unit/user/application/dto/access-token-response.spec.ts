// test/unit/auth/application/dto/access-token-response.spec.ts

import { AccessTokenResponseDto } from 'src/user/application/\bdto/access-token-response';

describe('AccessTokenResponseDto', () => {
  it('유효한 응답 객체가 생성되어야 한다.', () => {
    const token = 'access-token-value';

    const dto = new AccessTokenResponseDto(token);

    expect(dto.accessToken).toBe(token);
  });
});
