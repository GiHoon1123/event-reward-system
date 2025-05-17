import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  const mockContext = {
    getHandler: () => jest.fn(), // ✅ 함수로 반환
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;

  it('Public 데코레이터가 설정된 경우 true를 반환해야 한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('Public이 아닌 경우, 부모의 canActivate가 호출돼야 한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const superActivateSpy = jest
      .spyOn(JwtAuthGuard.prototype, 'canActivate')
      .mockReturnValueOnce(true);

    const result = guard.canActivate(mockContext);
    expect(superActivateSpy).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
