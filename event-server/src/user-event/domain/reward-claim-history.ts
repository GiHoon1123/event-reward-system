export class RewardClaimHistory {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
    public readonly rewardName: string,
    public readonly amount: number,
    public readonly status: 'SUCCESS' | 'FAILURE',
    public readonly claimedAt: Date,
    public readonly reason?: string,
  ) {}

  static success(
    eventId: string,
    email: string,
    rewardName: string,
    amount: number,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      eventId,
      email,
      rewardName,
      amount,
      'SUCCESS',
      new Date(),
    );
  }

  static failure(
    eventId: string,
    email: string,
    rewardName: string,
    amount: number,
    reason: string,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      eventId,
      email,
      rewardName,
      amount,
      'FAILURE',
      new Date(),
      reason,
    );
  }
}
