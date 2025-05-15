import { ConflictException } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends ConflictException {
  constructor(message = '이미 가입된 이메일입니다.') {
    super(message);
  }
}
