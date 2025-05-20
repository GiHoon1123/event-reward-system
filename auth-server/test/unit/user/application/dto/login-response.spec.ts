import { LoginResponseDto } from 'src/user/application/\bdto/login-response';

describe('LoginResponseDto', () => {
  it('유효한 커맨드 객체가 생성되어야 한다.', () => {
    const accessToken = 'access-token-value';
    const refreshToken = 'refresh-token-value';

    const dto = new LoginResponseDto(accessToken, refreshToken);

    expect(dto.accessToken).toBe(accessToken);
    expect(dto.refreshToken).toBe(refreshToken);
  });
});
