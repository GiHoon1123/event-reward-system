import { RewardType } from 'src/event/domain/reward';

export class RequestRewardCommand {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
    public readonly requestId: string,
    public readonly rewardToClaim: {
      type: RewardType;
      name: string;
      amount: number;
    },
  ) {}
}
