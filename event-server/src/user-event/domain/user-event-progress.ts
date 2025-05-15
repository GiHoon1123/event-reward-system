// src/user-event/domain/user-event-progress.ts

export class UserEventProgress {
  constructor(
    public readonly userEmail: string,
    private loginCount: number = 0,
  ) {}

  static createInitial(email: string): UserEventProgress {
    return new UserEventProgress(email, 1);
  }

  increase(): void {
    this.loginCount++;
  }

  getLoginCount(): number {
    return this.loginCount;
  }
}
