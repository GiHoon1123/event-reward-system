import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class RewardHistorySubdocument {
  @Prop({ required: true })
  rewardName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILURE'] })
  status: 'SUCCESS' | 'FAILURE';

  @Prop({ required: true })
  requestId: string;

  @Prop({ default: null })
  reason?: string;

  @Prop({ default: Date.now })
  claimedAt: Date;
}

@Schema({ collection: 'reward_claim_histories', timestamps: true })
export class RewardClaimHistoryEntity extends Document {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: [RewardHistorySubdocument],
    default: [],
  })
  rewards: RewardHistorySubdocument[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RewardClaimHistorySchema = SchemaFactory.createForClass(
  RewardClaimHistoryEntity,
);

RewardClaimHistorySchema.index({ eventId: 1, email: 1 }, { unique: true });
RewardClaimHistorySchema.set('versionKey', false);
RewardClaimHistorySchema.set('toJSON', { virtuals: true });
