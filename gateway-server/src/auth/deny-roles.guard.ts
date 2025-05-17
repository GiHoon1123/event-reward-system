import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class DenyRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.roles?.includes('AUDITOR')) {
      throw new ForbiddenException(
        'AUDITOR 역할은 이 리소스에 접근할 수 없습니다.',
      );
    }

    return true;
  }
}
