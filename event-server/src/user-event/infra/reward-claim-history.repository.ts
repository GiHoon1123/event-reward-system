import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardClaimHistory } from '../domain/reward-claim-history';
import { RewardClaimHistoryEntity } from './reward-claim-history.entity';
import { RewardClaimHistoryMapper } from './reward-claim-history.mapper';

@Injectable()
export class RewardClaimHistoryRepository {
  constructor(
    @InjectModel(RewardClaimHistoryEntity.name)
    private readonly model: Model<RewardClaimHistoryEntity>,
  ) {}

  /**
   * 멱등성 검사용: requestId가 존재하는지 확인
   */
  async hasRequestId(
    eventId: string,
    email: string,
    requestId: string,
  ): Promise<boolean> {
    const exists = await this.model.exists({
      eventId,
      email,
      rewards: { $elemMatch: { requestId } },
    });
    return !!exists;
  }

  /**
   * 성공한 특정 보상의 수령 수량 합계 계산
   */
  async getClaimedAmount(
    eventId: string,
    email: string,
    rewardName: string,
  ): Promise<number> {
    const doc = await this.model.findOne({ eventId, email }, { rewards: 1 });

    if (!doc) return 0;

    return doc.rewards
      .filter((r) => r.rewardName === rewardName && r.status === 'SUCCESS')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  /**
   * 새로운 보상 요청 내역을 배열에 추가
   */
  async appendReward(
    eventId: string,
    email: string,
    reward: RewardClaimHistory,
  ): Promise<void> {
    const entity = RewardClaimHistoryMapper.toEntity(reward);

    await this.model.updateOne(
      { eventId, email },
      {
        $setOnInsert: { eventId, email },
        $push: { rewards: entity },
      },
      { upsert: true },
    );
  }

  /**
   * 전체 히스토리를 도메인으로 조회
   */
  async findByEventAndEmail(
    eventId: string,
    email: string,
  ): Promise<RewardClaimHistory[]> {
    const doc = await this.model.findOne({ eventId, email });
    if (!doc) return [];

    return doc.rewards.map(RewardClaimHistoryMapper.toDomain);
  }

  /**
   * 성공한 히스토리만 필터링해서 조회
   */
  async findSuccessHistories(
    eventId: string,
    email: string,
  ): Promise<RewardClaimHistory[]> {
    const doc = await this.model.findOne({ eventId, email }, { rewards: 1 });
    if (!doc) return [];

    return doc.rewards
      .filter((r) => r.status === 'SUCCESS')
      .map(RewardClaimHistoryMapper.toDomain);
  }
}
