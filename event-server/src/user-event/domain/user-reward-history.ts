import { RewardClaimHistory } from './reward-claim-history';

export class UserRewardHistory {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
    public readonly rewards: RewardClaimHistory[] = [],
  ) {}

  /**
   * 해당 requestId가 이미 기록돼 있는지 확인
   */
  hasRequest(requestId: string): boolean {
    return this.rewards.some((r) => r.requestId === requestId);
  }

  /**
   * 특정 보상의 성공 수령 수량 합계를 계산
   */
  getClaimedAmount(rewardName: string): number {
    return this.rewards
      .filter((r) => r.rewardName === rewardName && r.status === 'SUCCESS')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  /**
   * 새로운 보상 요청 기록을 추가 (불변성 유지)
   */
  addRewardHistory(history: RewardClaimHistory): UserRewardHistory {
    return new UserRewardHistory(this.eventId, this.email, [
      ...this.rewards,
      history,
    ]);
  }
}
