import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginEventProgress } from '../domain/user-login-event-progress';
import { UserLoginEventProgressEntity } from './user-login-event-progress.entity';
import { UserLoginEventProgressMapper } from './user-login-event-progress.mapper';

@Injectable()
export class UserLoginEventProgressRepository {
  constructor(
    @InjectModel(UserLoginEventProgressEntity.name)
    private readonly userEventModel: Model<UserLoginEventProgressEntity>,
  ) {}

  async findByUserEmail(email: string): Promise<UserLoginEventProgress> {
    const found = await this.userEventModel.findOne({ email: email });
    return found ? UserLoginEventProgressMapper.toDomain(found) : null;
  }

  async findByUserEmailOrThrow(email: string): Promise<UserLoginEventProgress> {
    const found = await this.userEventModel.findOne({ email: email });
    if (!found) {
      throw new NotFoundException(
        `해당 유저는 아직 이벤트에 참여하지 않았습니다. 먼저 로그인하여 참여를 시작해 주세요. (email: ${email})`,
      );
    }
    return UserLoginEventProgressMapper.toDomain(found);
  }

  async save(progress: UserLoginEventProgress): Promise<void> {
    const update = UserLoginEventProgressMapper.toEntity(progress);
    await this.userEventModel.updateOne(
      { email: progress.email },
      { $set: update },
      { upsert: true },
    );
  }
}
