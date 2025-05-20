import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserEventStatus = 'IN_PROGRESS' | 'COMPLETED';

@Schema({ collection: 'user_login_event_progress', timestamps: true })
export class UserLoginEventProgressEntity extends Document {
  @Prop()
  email: string;

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

export const UserLoginEventProgressSchema = SchemaFactory.createForClass(
  UserLoginEventProgressEntity,
);

UserLoginEventProgressSchema.index({ email: 1 }, { unique: true });

UserLoginEventProgressSchema.set('versionKey', false);
UserLoginEventProgressSchema.set('toJSON', { virtuals: true });
