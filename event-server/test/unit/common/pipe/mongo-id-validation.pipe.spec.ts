import { BadRequestException } from '@nestjs/common';
import { MongoIdValidationPipe } from 'src/common/pipe/mongo-id-validation.pipe';

describe('MongoIdValidationPipe', () => {
  let pipe: MongoIdValidationPipe;

  beforeEach(() => {
    pipe = new MongoIdValidationPipe();
  });

  it('유효한 MongoDB ObjectId는 그대로 반환해야 한다', () => {
    const validId = '507f1f77bcf86cd799439011'; // 24자리 hex
    const result = pipe.transform(validId);

    expect(result).toBe(validId);
  });

  it('유효하지 않은 ID일 경우 BadRequestException을 던져야 한다', () => {
    const invalidId = '123-invalid-id';

    expect(() => pipe.transform(invalidId)).toThrow(BadRequestException);
    try {
      pipe.transform(invalidId);
    } catch (e) {
      expect(e.message).toBe('유효하지 않은 MongoDB ID입니다.');
    }
  });

  it('빈 문자열도 유효하지 않은 ID로 처리되어야 한다', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });
});
