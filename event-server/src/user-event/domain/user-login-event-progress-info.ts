export class UserLoginEventProgressInfo {
  constructor(
    public readonly eventId: string,
    public readonly current: number,
    public readonly required: number,
  ) {}

  isSatisfied(): boolean {
    return this.current >= this.required;
  }

  getRate(): number {
    return Math.min(100, Math.floor((this.current / this.required) * 100));
  }
}
