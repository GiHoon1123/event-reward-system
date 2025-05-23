import { Role } from 'src/user/domain/user';

export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
  ) {}
}
