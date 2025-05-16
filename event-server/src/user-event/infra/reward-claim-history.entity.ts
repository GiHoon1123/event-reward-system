import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'reward_claim_histories', timestamps: true })
export class RewardClaimHistoryEntity extends Document {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  rewardName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILURE'] })
  status: 'SUCCESS' | 'FAILURE';

  @Prop({ default: null })
  reason?: string;

  @Prop({ required: true })
  requestId: string;

  @Prop({ default: Date.now })
  claimedAt: Date;
}

export const RewardClaimHistorySchema = SchemaFactory.createForClass(
  RewardClaimHistoryEntity,
);

// RewardClaimHistorySchema.index({ email: 1 });
RewardClaimHistorySchema.index({ requestId: 1 }, { unique: true });
RewardClaimHistorySchema.set('versionKey', false);
RewardClaimHistorySchema.set('toJSON', { virtuals: true });
