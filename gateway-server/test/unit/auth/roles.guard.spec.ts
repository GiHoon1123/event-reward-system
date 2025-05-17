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

  const mockContext = (user?: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as unknown as ExecutionContext;

  it('역할 메타데이터가 없으면 true를 반환해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = mockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('user.roles에 필요한 역할이 포함되면 true를 반환해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);

    const context = mockContext({ roles: ['USER', 'ADMIN'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('user.roles에 필요한 역할이 없으면 ForbiddenException이 발생해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);

    const context = mockContext({ roles: ['USER'] });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('user 정보가 없으면 ForbiddenException이 발생해야 한다', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['USER']);

    const context = mockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
