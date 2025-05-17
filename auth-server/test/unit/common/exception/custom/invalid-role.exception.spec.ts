import { InvalidRoleException } from 'src/common/exception/custom/invalid-role.exception';

describe('InvalidRoleException', () => {
  it('올바른 메시지와 statusCode로 생성되어야 한다', () => {
    const exception = new InvalidRoleException();

    expect(exception.message).toBe('유효하지 않은 역할입니다.');
    expect(exception.getStatus()).toBe(400); // BadRequestException의 기본 status
  });
});
