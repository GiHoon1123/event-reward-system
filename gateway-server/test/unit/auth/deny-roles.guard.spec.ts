import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DenyRolesGuard } from '../../../src/auth/deny-roles.guard';

describe('DenyRolesGuard', () => {
  let guard: DenyRolesGuard;

  beforeEach(() => {
    guard = new DenyRolesGuard();
  });

  const createMockContext = (user?: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  it('AUDITOR 역할이면 ForbiddenException 발생', () => {
    const context = createMockContext({ roles: ['AUDITOR'] });

    expect(() => guard.canActivate(context)).toThrowError(
      new ForbiddenException('AUDITOR 역할은 이 리소스에 접근할 수 없습니다.'),
    );
  });

  it('USER 역할이면 true를 반환해야 한다', () => {
    const context = createMockContext({ roles: ['USER'] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('user 또는 roles가 없는 경우 ForbiddenException 발생 (기본 메시지)', () => {
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrowError(
      new ForbiddenException('접근 권한이 없습니다.'),
    );
  });
});
