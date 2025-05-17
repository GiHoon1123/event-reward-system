// test/unit/auth/roles.guard.spec.ts

import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../src/auth/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  // 공통 mock context 함수
  const mockContext = (role?: string | null) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role } : {},
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    }) as any;

  it('유저 역할이 허용된 역할에 포함될 경우 true 반환', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['ADMIN', 'USER']); // 허용된 역할

    const context = mockContext('USER');
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('유저 역할이 허용된 역할에 포함되지 않으면 ForbiddenException 발생', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']); // 허용된 역할

    const context = mockContext('USER');

    expect(() => guard.canActivate(context)).toThrowError(ForbiddenException);
  });

  it('@Roles 데코레이터가 없으면 true 반환', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined); // 메타데이터 없음

    const context = mockContext('ANY');
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('user 정보가 없는 경우 ForbiddenException 발생', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const context = mockContext(null); // 유저 없음

    expect(() => guard.canActivate(context)).toThrowError(ForbiddenException);
  });
});
