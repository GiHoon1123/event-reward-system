import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserEventStatus = 'IN_PROGRESS' | 'COMPLETED';

@Schema({ collection: 'user_event_progress', timestamps: true })
export class UserEventProgressEntity extends Document {
  @Prop({ required: true, unique: true })
  userEmail: string;

  @Prop({ required: true, default: 0 })
  loginCount: number;

  @Prop({
    required: true,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS',
  })
  status: UserEventStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserEventProgressEntitySchema = SchemaFactory.createForClass(
  UserEventProgressEntity,
);

UserEventProgressEntitySchema.set('versionKey', false);
UserEventProgressEntitySchema.set('toJSON', { virtuals: true });
