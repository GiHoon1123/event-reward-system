// src/user-event/infrastructure/reward-claim-history.mapper.ts

import { RewardClaimHistory } from '../domain/reward-claim-history';
import { RewardClaimHistoryEntity } from './reward-claim-history.entity';

export class RewardClaimHistoryMapper {
  static toEntity(history: RewardClaimHistory): Record<string, any> {
    return {
      eventId: history.eventId,
      userEmail: history.userEmail,
      rewardName: history.rewardName,
      amount: history.amount,
      claimedAt: history.claimedAt,
    };
  }

  static toDomain(entity: RewardClaimHistoryEntity): RewardClaimHistory {
    return new RewardClaimHistory(
      entity.eventId,
      entity.userEmail,
      entity.rewardName,
      entity.amount,
      entity.status,
      entity.claimedAt,
      entity.reason ?? undefined,
    );
  }
}
