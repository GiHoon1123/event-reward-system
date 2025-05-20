import { BadRequestException } from '@nestjs/common';

export class NotEventCreatorException extends BadRequestException {
  constructor(message = '이벤트 생성자만 이 작업을 수행할 수 있습니다.') {
    super(message);
  }
}
