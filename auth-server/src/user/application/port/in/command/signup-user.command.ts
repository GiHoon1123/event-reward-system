// src/user/application/port/in/command/signup-user.command.ts

import { Role } from '../../../../domain/user';

export class SignupUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role = Role.USER,
  ) {}
}
