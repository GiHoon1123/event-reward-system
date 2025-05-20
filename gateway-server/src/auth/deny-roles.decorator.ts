import { SetMetadata } from '@nestjs/common';
export const DenyRoles = (...roles: string[]) =>
  SetMetadata('denyRoles', roles);
