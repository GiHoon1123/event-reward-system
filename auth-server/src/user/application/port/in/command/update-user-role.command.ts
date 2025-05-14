// src/user/application/port/in/command/update-user-role.command.ts

import { Role } from '../../../../domain/user';

export class UpdateUserRoleCommand {
  constructor(
    public readonly email: string,
    public readonly role: Role,
  ) {}
}
