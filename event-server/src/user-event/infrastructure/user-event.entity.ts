// src/user-event/infrastructure/user-event.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user_event_progress', timestamps: true })
export class UserEventEntity extends Document {
  @Prop({ required: true, unique: true })
  userEmail: string;

  @Prop({ required: true, default: 0 })
  loginCount: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserEventEntitySchema =
  SchemaFactory.createForClass(UserEventEntity);

UserEventEntitySchema.set('versionKey', false);
UserEventEntitySchema.set('toJSON', { virtuals: true });
