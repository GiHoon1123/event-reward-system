// src/common/exception/custom/not-event-creator.exception.ts

import { BadRequestException } from '@nestjs/common';

export class NotEventCreatorException extends BadRequestException {
  constructor() {
    super('이벤트 생성자만 보상을 등록할 수 있습니다.');
  }
}
