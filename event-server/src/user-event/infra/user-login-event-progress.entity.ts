import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserEventStatus = 'IN_PROGRESS' | 'COMPLETED';

@Schema({ collection: 'user_login_event_progress', timestamps: true })
export class UserLoginEventProgressEntity extends Document {
  @Prop({ required: true, unique: true })
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

export const UserLoginEventProgressEntitySchema = SchemaFactory.createForClass(
  UserLoginEventProgressEntity,
);

UserLoginEventProgressEntitySchema.index({ email: 1 }, { unique: true });

UserLoginEventProgressEntitySchema.set('versionKey', false);
UserLoginEventProgressEntitySchema.set('toJSON', { virtuals: true });
