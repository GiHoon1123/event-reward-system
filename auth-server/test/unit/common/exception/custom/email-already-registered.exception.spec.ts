import { EmailAlreadyRegisteredException } from 'src/common/exception/custom/email-already-registered.exception';

describe('EmailAlreadyRegisteredException', () => {
  it('기본 메시지로 생성되어야 한다', () => {
    const exception = new EmailAlreadyRegisteredException();

    expect(exception.message).toBe('이미 가입된 이메일입니다.');
    expect(exception.getStatus()).toBe(409); // ConflictException의 기본 statusCode
  });

  it('커스텀 메시지로 생성할 수 있어야 한다', () => {
    const exception = new EmailAlreadyRegisteredException(
      '이미 사용 중인 이메일입니다.',
    );

    expect(exception.message).toBe('이미 사용 중인 이메일입니다.');
    expect(exception.getStatus()).toBe(409);
  });
});
