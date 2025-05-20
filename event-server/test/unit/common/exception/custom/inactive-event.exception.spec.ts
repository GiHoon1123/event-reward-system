import { BadRequestException } from '@nestjs/common';
import { InactiveEventException } from 'src/common/exception/custom/inactive-event.exception';

describe('InactiveEventException', () => {
  it('BadRequestException을 상속받아야 한다', () => {
    const exception = new InactiveEventException();
    expect(exception).toBeInstanceOf(BadRequestException);
  });

  it('예외 메시지는 "해당 이벤트는 종료된 상태입니다. (INACTIVE)" 이어야 한다', () => {
    const exception = new InactiveEventException();
    expect(exception.message).toBe(
      '해당 이벤트는 종료된 상태입니다. (INACTIVE)',
    );
  });

  it('HTTP 상태 코드는 400이어야 한다', () => {
    const exception = new InactiveEventException();
    expect(exception.getStatus()).toBe(400);
  });

  it('기본 예외 응답 형식이 올바르게 반환되어야 한다', () => {
    const exception = new InactiveEventException();
    const response = exception.getResponse();

    expect(response).toEqual({
      statusCode: 400,
      message: '해당 이벤트는 종료된 상태입니다. (INACTIVE)',
      error: 'Bad Request',
    });
  });
});
