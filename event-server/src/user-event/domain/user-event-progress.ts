export type UserEventStatus = 'IN_PROGRESS' | 'COMPLETED';

export class UserEventProgress {
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

  static createInitial(email: string): UserEventProgress {
    return new UserEventProgress(email, 0, 'IN_PROGRESS');
  }
}
