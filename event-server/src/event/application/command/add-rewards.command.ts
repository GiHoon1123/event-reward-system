export class AddRewardsCommand {
  constructor(
    public readonly eventId: string,
    public readonly rewards: {
      name: string;
      amount: number;
    }[],
    public readonly requestedBy: string,
  ) {}
}
