import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User } from '../domain/user';
import { UserDocument, UserEntity } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const exists = await this.userModel.exists({ email });
    return !!exists;
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

  async findById(id: string): Promise<User | null> {
    const entity = await this.userModel.findById(id);
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async updateRoleByEmail(email: string, role: Role): Promise<void> {
    await this.userModel.updateOne({ email }, { $set: { role } });
  }
}
