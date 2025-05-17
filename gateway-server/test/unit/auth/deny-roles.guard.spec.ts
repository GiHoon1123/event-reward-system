import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DenyRolesGuard } from 'src/auth/deny-roles.guard';

describe('DenyRolesGuard', () => {
  let guard: DenyRolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new DenyRolesGuard(reflector);
  });

  const mockContext = (role: string | null = null) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: role ? { role } : null, // 유저 역할 설정
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    }) as any;

  it('접근 금지된 역할일 경우 ForbiddenException을 던져야 한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['AUDITOR']); // 접근 금지 역할

    const context = mockContext('AUDITOR'); // 현재 유저도 AUDITOR

    expect(() => guard.canActivate(context)).toThrowError(ForbiddenException);
  });

  it('접근 금지된 역할이 아닌 경우 true를 반환해야 한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['AUDITOR']);

    const context = mockContext('USER'); // 접근 가능 역할

    expect(guard.canActivate(context)).toBe(true);
  });

  it('접근 금지된 역할이 설정되지 않은 경우 true를 반환해야 한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined); // denyRoles 없음

    const context = mockContext('ADMIN');

    expect(guard.canActivate(context)).toBe(true);
  });
});
