export type UserEventStatus = 'IN_PROGRESS' | 'COMPLETED';

export class UserLoginEventProgress {
  constructor(
    public readonly email: string,
    private loginCount: number,
    private status: UserEventStatus = 'IN_PROGRESS',
  ) {}

  getLoginCount(): number {
    return this.loginCount;
  }

  getStatus(): UserEventStatus {
    return this.status;
  }

  increase(): void {
    this.loginCount++;
  }

  markComplete(): void {
    this.status = 'COMPLETED';
  }

  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  static createInitial(email: string): UserLoginEventProgress {
    return new UserLoginEventProgress(email, 1, 'IN_PROGRESS');
  }
}
