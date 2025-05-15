// src/user-event/infrastructure/user-event.repository.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEventProgress } from '../domain/user-event-progress';
import { UserEventProgressEntity } from './user-event-progress.entity';
import { UserEventMapper } from './user-event-progress.mapper';

@Injectable()
export class UserEventRepository {
  constructor(
    @InjectModel(UserEventProgressEntity.name)
    private readonly userEventModel: Model<UserEventProgressEntity>,
  ) {}

  async findByUserEmail(email: string): Promise<UserEventProgress | null> {
    const found = await this.userEventModel.findOne({ userEmail: email });
    if (found == null) {
      throw new NotFoundException(
        `해당 유저는 아직 이벤트에 참여하지 않았습니다. 먼저 로그인하여 참여를 시작해 주세요. (email: ${email})`,
      );
    }
    return found ? UserEventMapper.toDomain(found) : null;
  }
  async save(progress: UserEventProgress): Promise<void> {
    const update = UserEventMapper.toEntity(progress);
    await this.userEventModel.updateOne(
      { userEmail: progress.userEmail },
      { $set: update },
      { upsert: true },
    );
  }
}
