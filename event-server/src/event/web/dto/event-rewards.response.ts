export class RewardItemDto {
  name: string;
  type: string;
  amount: number;

  constructor(partial: Partial<RewardItemDto>) {
    Object.assign(this, partial);
  }
}

export class EventRewardResponseDto {
  eventId: string;
  title: string;
  rewards: RewardItemDto[];

  constructor(partial: Partial<EventRewardResponseDto>) {
    Object.assign(this, partial);
  }
}
