import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../src/auth/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as ExecutionContext;

  it('역할 메타데이터가 없으면 true를 반환해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('user.roles에 필요한 역할이 포함되면 true를 반환해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);

    const context = createMockContext({ roles: ['USER', 'ADMIN'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('user.roles에 필요한 역할이 없으면 ForbiddenException 발생 (정확한 메시지)', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);

    const context = createMockContext({ roles: ['USER'], role: 'USER' });

    expect(() => guard.canActivate(context)).toThrowError(
      new ForbiddenException('USER 역할은 이 리소스에 접근할 수 없습니다.'),
    );
  });

  it('user가 없으면 ForbiddenException 발생 (기본 메시지)', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['USER']);

    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrowError(
      new ForbiddenException('접근 권한이 없습니다.'),
    );
  });
});
