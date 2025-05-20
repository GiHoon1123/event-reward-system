import { RewardClaimHistory } from '../domain/reward-claim-history';
import { RewardHistorySubdocument } from './reward-claim-history.entity';

export class RewardClaimHistoryMapper {
  static toEntity(history: RewardClaimHistory): RewardHistorySubdocument {
    return {
      rewardName: history.rewardName,
      amount: history.amount,
      status: history.status,
      requestId: history.requestId,
      claimedAt: history.claimedAt,
      ...(history.reason && { reason: history.reason }),
    };
  }

  static toDomain(entity: RewardHistorySubdocument): RewardClaimHistory {
    return new RewardClaimHistory(
      entity.rewardName,
      entity.amount,
      entity.status,
      entity.requestId,
      entity.claimedAt,
      entity.reason ?? undefined,
    );
  }
}
