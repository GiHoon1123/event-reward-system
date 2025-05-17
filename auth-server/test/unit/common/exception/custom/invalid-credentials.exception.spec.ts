import { InvalidCredentialsException } from 'src/common/exception/custom/invalid-credentials.exception';

describe('InvalidCredentialsException', () => {
  it('기본 메시지로 생성되어야 한다', () => {
    const exception = new InvalidCredentialsException();

    expect(exception.message).toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
    expect(exception.getStatus()).toBe(401); // UnauthorizedException의 기본 statusCode
  });

  it('커스텀 메시지로 생성할 수 있어야 한다', () => {
    const exception = new InvalidCredentialsException(
      '잘못된 로그인 정보입니다.',
    );

    expect(exception.message).toBe('잘못된 로그인 정보입니다.');
    expect(exception.getStatus()).toBe(401);
  });
});
