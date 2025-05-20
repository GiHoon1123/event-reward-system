import { BadRequestException } from '@nestjs/common';

export class InvalidRoleException extends BadRequestException {
  constructor() {
    super('유효하지 않은 역할입니다.');
  }
}
