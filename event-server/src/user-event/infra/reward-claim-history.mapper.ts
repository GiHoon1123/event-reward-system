import { RewardClaimHistory } from '../domain/reward-claim-history';
import { RewardClaimHistoryEntity } from './reward-claim-history.entity';

export class RewardClaimHistoryMapper {
  static toEntity(history: RewardClaimHistory): Record<string, any> {
    return {
      eventId: history.eventId,
      email: history.email,
      rewardName: history.rewardName,
      amount: history.amount,
      status: history.status,
      claimedAt: history.claimedAt,
      requestId: history.requestId,
      ...(history.reason && { reason: history.reason }),
    };
  }

  static toDomain(entity: RewardClaimHistoryEntity): RewardClaimHistory {
    return new RewardClaimHistory(
      entity.eventId,
      entity.email,
      entity.rewardName,
      entity.amount,
      entity.status,
      entity.claimedAt,
      entity.requestId,
      entity.reason ?? undefined,
    );
  }
}
