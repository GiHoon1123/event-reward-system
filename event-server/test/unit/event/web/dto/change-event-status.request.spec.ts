import { validate } from 'class-validator';
import { ChangeEventStatusRequestDto } from 'src/event/web/dto/change-event-status.request';

describe('ChangeEventStatusRequestDto', () => {
  it('status가 "ACTIVE" 또는 "INACTIVE"이면 유효해야 한다', async () => {
    const dto = new ChangeEventStatusRequestDto();
    dto.status = 'ACTIVE';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    dto.status = 'INACTIVE';
    const errors2 = await validate(dto);
    expect(errors2.length).toBe(0);
  });

  it('status가 유효하지 않은 값이면 에러가 발생해야 한다', async () => {
    const dto = new ChangeEventStatusRequestDto();
    dto.status = 'PAUSED' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isIn).toBe(
      'status는 ACTIVE 또는 INACTIVE 중 하나여야 합니다.',
    );
  });

  it('status가 비어 있으면 에러가 발생해야 한다', async () => {
    const dto = new ChangeEventStatusRequestDto();
    dto.status = undefined as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
