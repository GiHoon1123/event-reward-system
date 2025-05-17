import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../domain/user';

@Schema({ collection: 'users' })
export class UserEntity {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ default: null })
  refreshToken: string | null;
}
export type UserDocument = UserEntity & Document;
export const UserSchema = SchemaFactory.createForClass(UserEntity);
