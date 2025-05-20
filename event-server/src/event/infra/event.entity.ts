import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RewardEntity {
  @Prop({ required: true })
  type: string; // 'ITEM'

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;
}

@Schema({ collection: 'events', timestamps: true })
export class EventEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Object, required: true })
  condition: {
    type: string;
    value: number;
  };

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ type: [RewardEntity], default: [] })
  rewards: RewardEntity[];

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EventEntitySchema = SchemaFactory.createForClass(EventEntity);
EventEntitySchema.set('versionKey', false);
EventEntitySchema.set('toJSON', { virtuals: true });
