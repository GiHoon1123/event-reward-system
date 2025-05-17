import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DenyRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const deniedRoles = this.reflector.getAllAndOverride<string[]>(
      'denyRoles',
      [context.getHandler(), context.getClass()],
    );

    if (!deniedRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (user && deniedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `역할 ${user.role}은 이 리소스에 접근할 수 없습니다.`,
      );
    }

    return true;
  }
}
