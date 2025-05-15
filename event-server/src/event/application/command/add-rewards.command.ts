// src/event/application/command/add-rewards.command.ts

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
