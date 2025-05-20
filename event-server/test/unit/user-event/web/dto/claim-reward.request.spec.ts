import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClaimRewardRequestDto } from 'src/user-event/web/dto/claim-reward.request';

describe('ClaimRewardRequestDto 유효성 검사', () => {
  it('모든 필드가 유효하면 통과해야 한다', async () => {
    const validDto = plainToInstance(ClaimRewardRequestDto, {
      name: '극한성장의 비약',
      amount: 100,
      requestId: '41b63bb2-4b82-417e-a731-0bbf35d2cd17',
    });

    const errors = await validate(validDto);
    expect(errors.length).toBe(0);
  });

  it('amount가 음수이면 유효성 검사에 실패해야 한다', async () => {
    const dto = plainToInstance(ClaimRewardRequestDto, {
      name: '극한성장의 비약',
      amount: -10,
      requestId: '41b63bb2-4b82-417e-a731-0bbf35d2cd17',
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'amount')).toBe(true);
  });

  it('requestId가 UUID 형식이 아니면 실패해야 한다', async () => {
    const dto = plainToInstance(ClaimRewardRequestDto, {
      name: '극한성장의 비약',
      amount: 10,
      requestId: 'invalid-uuid',
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'requestId')).toBe(true);
  });

  it('name이 문자열이 아니면 실패해야 한다', async () => {
    const dto = plainToInstance(ClaimRewardRequestDto, {
      name: 123,
      amount: 10,
      requestId: '41b63bb2-4b82-417e-a731-0bbf35d2cd17',
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });
});
