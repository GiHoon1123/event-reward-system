// src/user/application/port/in/command/login-user.command.ts

export class LoginUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
