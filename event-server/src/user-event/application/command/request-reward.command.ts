import { RewardType } from 'src/event/domain/reward';

export class RequestRewardCommand {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
    public readonly rewardsToClaim: {
      type: RewardType;
      name: string;
      amount: number;
    }[],
  ) {}
}
