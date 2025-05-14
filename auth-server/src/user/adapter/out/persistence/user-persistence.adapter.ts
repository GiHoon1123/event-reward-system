// src/user/adapter/out/persistence/user-persistence.adapter.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPersistencePort } from '../../../application/port/out/user-persistence.port';
import { Role, User } from '../../../domain/user';
import { UserDocument, UserEntity } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserPersistenceAdapter implements UserPersistencePort {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ email });
    return count > 0;
  }

  async save(user: User): Promise<User> {
    const entity = new this.userModel(UserMapper.toEntity(user));
    const saved = await entity.save();
    return UserMapper.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userModel.findOne({ email });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    return user ? UserMapper.toDomain(user) : null;
  }

  async updateRoleByEmail(email: string, role: Role): Promise<void> {
    await this.userModel.updateOne(
      { email },
      { $set: { role: role.toString() } }, // enum → string
    );
  }

  async updateRefreshTokenByUserId(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }
}
