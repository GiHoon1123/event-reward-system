// src/user/application/port/in/command/refresh-access-token.command.ts

export class RefreshAccessTokenCommand {
  constructor(public readonly refreshToken: string) {}
}
