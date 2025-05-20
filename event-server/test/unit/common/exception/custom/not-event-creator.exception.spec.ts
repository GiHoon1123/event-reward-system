import { BadRequestException } from '@nestjs/common';
import { NotEventCreatorException } from 'src/common/exception/custom/not-event-creator.exception';

describe('NotEventCreatorException', () => {
  it('BadRequestException을 상속받아야 한다', () => {
    const exception = new NotEventCreatorException();
    expect(exception).toBeInstanceOf(BadRequestException);
  });

  it('기본 메시지는 "이벤트 생성자만 이 작업을 수행할 수 있습니다." 이어야 한다', () => {
    const exception = new NotEventCreatorException();
    expect(exception.message).toBe(
      '이벤트 생성자만 이 작업을 수행할 수 있습니다.',
    );
  });

  it('생성자에 전달된 커스텀 메시지를 사용할 수 있어야 한다', () => {
    const customMessage = '권한이 없습니다.';
    const exception = new NotEventCreatorException(customMessage);
    expect(exception.message).toBe(customMessage);
  });

  it('HTTP 상태 코드는 400이어야 한다', () => {
    const exception = new NotEventCreatorException();
    expect(exception.getStatus()).toBe(400);
  });

  it('예외 응답 형식은 NestJS 기본 구조를 따라야 한다', () => {
    const exception = new NotEventCreatorException();
    expect(exception.getResponse()).toEqual({
      statusCode: 400,
      message: '이벤트 생성자만 이 작업을 수행할 수 있습니다.',
      error: 'Bad Request',
    });
  });
});
