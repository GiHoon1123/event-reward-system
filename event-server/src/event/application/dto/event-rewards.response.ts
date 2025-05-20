export class RewardItem {
  name: string;
  type: string;
  amount: number;

  constructor(partial: Partial<RewardItem>) {
    Object.assign(this, partial);
  }
}

export class EventRewardResponse {
  eventId: string;
  title: string;
  rewards: RewardItem[];

  constructor(partial: Partial<EventRewardResponse>) {
    Object.assign(this, partial);
  }
}
