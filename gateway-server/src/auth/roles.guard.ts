import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log('user', user);

    const hasRequiredRole =
      user?.roles && requiredRoles.some((role) => user.roles.includes(role));

    if (!user || !hasRequiredRole) {
      const roleMessage = user?.role
        ? `${user.role} 역할은 이 리소스에 접근할 수 없습니다.`
        : '접근 권한이 없습니다.';
      throw new ForbiddenException(roleMessage);
    }

    return true;
  }
}
