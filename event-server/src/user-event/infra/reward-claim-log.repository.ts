import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardClaimLogEntity } from './reward-claim-log.entity';

@Injectable()
export class RewardClaimLogRepository {
  constructor(
    @InjectModel(RewardClaimLogEntity.name)
    private readonly model: Model<RewardClaimLogEntity>,
  ) {}

  async saveLog(log: {
    email: string;
    eventId: string;
    rewardName: string;
    amount: number;
    status: 'SUCCESS' | 'FAILURE';
    requestId: string;
    claimedAt: Date;
    reason?: string;
  }): Promise<void> {
    try {
      await this.model.create(log);
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('이미 처리된 요청입니다.');
      }
      throw err;
    }
  }

  async findAllWithPage(
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimLogEntity[] }> {
    const [items, totalCount] = await Promise.all([
      this.model
        .find()
        .sort({ claimedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(),
    ]);

    return { totalCount, items };
  }

  async findByUserWithPage(
    email: string,
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimLogEntity[] }> {
    const [items, totalCount] = await Promise.all([
      this.model
        .find({ email })
        .sort({ claimedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ email }),
    ]);

    return { totalCount, items };
  }
}
