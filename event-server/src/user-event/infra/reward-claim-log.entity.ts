import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'reward_claim_logs', timestamps: true })
export class RewardClaimLogEntity extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  rewardName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILURE'] })
  status: 'SUCCESS' | 'FAILURE';

  @Prop()
  reason?: string;

  @Prop({ required: true })
  requestId: string;

  @Prop({ default: Date.now })
  claimedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RewardClaimLogSchema =
  SchemaFactory.createForClass(RewardClaimLogEntity);

RewardClaimLogSchema.index({ email: 1 });
RewardClaimLogSchema.index({ eventId: 1 });
RewardClaimLogSchema.index({ claimedAt: -1 });
RewardClaimLogSchema.index({ requestId: 1 }, { unique: true }); // 멱등성 보장

RewardClaimLogSchema.set('versionKey', false);
RewardClaimLogSchema.set('toJSON', { virtuals: true });
