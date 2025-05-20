import { validate } from 'class-validator';
import { EventRewardRequestDto } from 'src/event/web/dto/event-reward.request';

describe('EventRewardRequestDto', () => {
  const validDto = {
    type: 'ITEM',
    name: '극한성장의 비약',
    amount: 100,
  };

  it('유효한 값이면 검증을 통과해야 한다', async () => {
    const dto = Object.assign(new EventRewardRequestDto(), validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('type이 잘못된 enum 값이면 실패해야 한다', async () => {
    const dto = Object.assign(new EventRewardRequestDto(), {
      ...validDto,
      type: 'INVALID',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('name이 문자열이 아니면 실패해야 한다', async () => {
    const dto = Object.assign(new EventRewardRequestDto(), {
      ...validDto,
      name: 123,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('amount가 0 이하이면 실패해야 한다', async () => {
    const dto = Object.assign(new EventRewardRequestDto(), {
      ...validDto,
      amount: 0,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });
});
