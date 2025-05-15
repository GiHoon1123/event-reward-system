// src/user-event/application/command/increase-login-count.command.ts

export class IncreaseLoginCountCommand {
  constructor(public readonly userEmail: string) {}
}
