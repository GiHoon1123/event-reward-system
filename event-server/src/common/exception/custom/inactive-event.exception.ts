import { BadRequestException } from '@nestjs/common';

export class InactiveEventException extends BadRequestException {
  constructor() {
    super('해당 이벤트는 종료된 상태입니다. (INACTIVE)');
  }
}
