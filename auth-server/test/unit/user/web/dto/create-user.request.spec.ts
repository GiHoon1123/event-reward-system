// test/unit/user/web/dto/create-user.request.spec.ts

import { validate } from 'class-validator';
import { CreateUserRequestDto } from 'src/user/web/dto/create-user.request';

describe('CreateUserRequestDto', () => {
  it('유효한 email과 password일 경우 통과해야 한다', async () => {
    const dto = new CreateUserRequestDto();
    dto.email = 'user@example.com';
    dto.password = 'securePassword';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('이메일이 없거나 형식이 틀리면 에러가 발생해야 한다', async () => {
    const dto = new CreateUserRequestDto();
    dto.email = 'invalid-email';
    dto.password = 'securePassword';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('비밀번호가 8자 미만이면 에러가 발생해야 한다', async () => {
    const dto = new CreateUserRequestDto();
    dto.email = 'user@example.com';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });
});
