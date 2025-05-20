export class RewardClaimHistory {
  constructor(
    public readonly rewardName: string,
    public readonly amount: number,
    public readonly status: 'SUCCESS' | 'FAILURE',
    public readonly requestId: string,
    public readonly claimedAt: Date,
    public readonly reason?: string,
  ) {}

  static success(
    rewardName: string,
    amount: number,
    requestId: string,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      rewardName,
      amount,
      'SUCCESS',
      requestId,
      new Date(),
    );
  }

  static failure(
    rewardName: string,
    amount: number,
    reason: string,
    requestId: string,
  ): RewardClaimHistory {
    return new RewardClaimHistory(
      rewardName,
      amount,
      'FAILURE',
      requestId,
      new Date(),
      reason,
    );
  }
}
