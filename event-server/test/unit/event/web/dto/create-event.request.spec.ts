import { validate } from 'class-validator';
import { CreateEventRequestDto } from 'src/event/web/dto/create-event.request';

describe('CreateEventRequestDto', () => {
  const validDto = {
    title: '3회 로그인 이벤트',
    description: '3번 로그인하면 아이템을 드립니다.',
    conditionType: 'LOGIN_COUNT',
    conditionValue: 3,
    startAt: '2025-05-15T00:00:00Z',
    endAt: '2025-06-01T23:59:59Z',
  };

  it('모든 값이 유효할 경우 통과해야 한다', async () => {
    const dto = Object.assign(new CreateEventRequestDto(), validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('conditionType이 LOGIN_COUNT가 아니면 실패해야 한다', async () => {
    const dto = Object.assign(new CreateEventRequestDto(), {
      ...validDto,
      conditionType: 'FRIEND_INVITE',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isIn).toBe(
      'conditionType은 LOGIN_COUNT만 가능합니다.',
    );
  });

  it('conditionValue가 0 이하이면 실패해야 한다', async () => {
    const dto = Object.assign(new CreateEventRequestDto(), {
      ...validDto,
      conditionValue: 0,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('startAt이 유효한 날짜 형식이 아니면 실패해야 한다', async () => {
    const dto = Object.assign(new CreateEventRequestDto(), {
      ...validDto,
      startAt: 'invalid-date',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isDateString).toBeDefined();
  });

  it('endAt이 유효한 날짜 형식이 아니면 실패해야 한다', async () => {
    const dto = Object.assign(new CreateEventRequestDto(), {
      ...validDto,
      endAt: '',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isDateString).toBeDefined();
  });
});
