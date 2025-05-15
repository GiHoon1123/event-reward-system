// src/user-event/domain/reward-claim-history.ts

export class RewardClaimHistory {
  constructor(
    public readonly eventId: string,
    public readonly userEmail: string,
    public readonly rewardName: string,
    public readonly amount: number,
    public readonly status: 'SUCCESS' | 'FAILURE',
    public readonly claimedAt: Date,
    public readonly reason?: string,
  ) {}

  static success(
    eventId: string,
    userEmail: string,
    rewardName: string,
    amount: number,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      eventId,
      userEmail,
      rewardName,
      amount,
      'SUCCESS',
      new Date(),
    );
  }

  static failure(
    eventId: string,
    userEmail: string,
    rewardName: string,
    amount: number,
    reason: string,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      eventId,
      userEmail,
      rewardName,
      amount,
      'FAILURE',
      new Date(),
      reason,
    );
  }
}
