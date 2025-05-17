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

    if (!user || !user.roles) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}
