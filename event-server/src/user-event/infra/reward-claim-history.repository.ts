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

  async save(history: RewardClaimHistory): Promise<void> {
    const entity = RewardClaimHistoryMapper.toEntity(history);
    await this.model.create(entity);
  }

  async findByRequestId(requestId: string): Promise<RewardClaimHistory | null> {
    const entity = await this.model.findOne({ requestId }).exec();
    return entity ? RewardClaimHistoryMapper.toDomain(entity) : null;
  }

  async findByUserAndEvent(
    email: string,
    eventId: string,
  ): Promise<RewardClaimHistory[]> {
    const entities = await this.model
      .find({ email, eventId })
      .sort({ claimedAt: -1 })
      .exec();
    return entities ?? entities.map(RewardClaimHistoryMapper.toDomain);
  }

  async findByEventAndUserSuccessOnly(
    eventId: string,
    email: string,
  ): Promise<RewardClaimHistory[]> {
    const entities = await this.model
      .find({ eventId, email, status: 'SUCCESS' })
      .exec();
    return entities.map(RewardClaimHistoryMapper.toDomain);
  }

  async hasAlreadyClaimed(
    email: string,
    eventId: string,
    rewardName: string,
  ): Promise<boolean> {
    const count = await this.model.countDocuments({
      email,
      eventId,
      rewardName,
    });
    return count > 0;
  }

  async findByUserWithPage(
    email: string,
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimHistory[] }> {
    const query = { email };

    const [items, totalCount] = await Promise.all([
      this.model
        .find(query)
        .sort({ claimedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);

    return {
      totalCount,
      items: items.map(RewardClaimHistoryMapper.toDomain),
    };
  }

  async findAllWithPage(
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimHistory[] }> {
    const query: any = {};

    const [items, totalCount] = await Promise.all([
      this.model
        .find(query)
        .sort({ claimedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query),
    ]);

    return {
      totalCount,
      items: items.map(RewardClaimHistoryMapper.toDomain),
    };
  }
}
