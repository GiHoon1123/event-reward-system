// test/unit/user/web/dto/update-user-role.request.spec.ts

import { validate } from 'class-validator';
import { Role } from 'src/user/domain/user';
import { UpdateUserRoleRequestDto } from 'src/user/web/dto/update-user-role.request';

describe('UpdateUserRoleRequestDto', () => {
  it('유효한 이메일과 enum 값이면 통과해야 한다', async () => {
    const dto = new UpdateUserRoleRequestDto();
    dto.email = 'admin@example.com';
    dto.role = Role.ADMIN;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('이메일 형식이 틀리면 에러가 발생해야 한다', async () => {
    const dto = new UpdateUserRoleRequestDto();
    dto.email = 'invalid-email';
    dto.role = Role.OPERATOR;

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('enum 값이 아니면 에러가 발생해야 한다', async () => {
    const dto = new UpdateUserRoleRequestDto();
    dto.email = 'user@example.com';
    // @ts-expect-error: 유효하지 않은 enum 값 테스트
    dto.role = 'INVALID_ROLE';

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'role')).toBe(true);
  });
});
