import { Role } from '../../domain/user';

export class ChangeUserRoleCommand {
  constructor(
    public readonly email: string,
    public readonly newRole: Role,
  ) {}
}
