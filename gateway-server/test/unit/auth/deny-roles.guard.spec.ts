import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DenyRolesGuard } from '../../../src/auth/deny-roles.guard';

describe('DenyRolesGuard', () => {
  let guard: DenyRolesGuard;

  beforeEach(() => {
    guard = new DenyRolesGuard();
  });

  const createMockContext = (roles?: string[]): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user: { roles }, // ✅ 배열로 주입
        }),
      }),
    }) as unknown as ExecutionContext;

  it('AUDITOR 역할이면 ForbiddenException을 던져야 한다', () => {
    const context = createMockContext(['AUDITOR']);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('USER 역할이면 true를 반환해야 한다', () => {
    const context = createMockContext(['USER']);
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('user가 없는 경우에도 true를 반환해야 한다', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}), // user 없음
      }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });
});
