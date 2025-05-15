// src/event/infrastructure/event.repository.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../domain/event';
import { Reward } from '../domain/reward';
import { EventEntity } from './event.entity';
import { EventMapper } from './event.mapper';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventEntity>,
  ) {}

  async save(event: Event): Promise<Event> {
    const raw = EventMapper.toEntity(event);
    const created = await this.eventModel.create(raw);
    return EventMapper.toDomain(created);
  }

  async findById(id: string): Promise<Event | null> {
    const entity = await this.eventModel.findById(id).exec();
    if (entity == null) {
      throw new NotFoundException(`이벤트를 찾을 수 없습니다. (id: ${id})`);
    }

    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Event[]> {
    const list = await this.eventModel.find().exec();
    return list.map(EventMapper.toDomain);
  }

  async updateRewards(eventId: string, rewards: Reward[]): Promise<void> {
    await this.eventModel.findByIdAndUpdate(eventId, {
      rewards: rewards.map((r) => ({
        type: r.type,
        name: r.name,
        amount: r.amount,
      })),
    });
  }

  async findByPage(page: number, limit: number): Promise<Event[]> {
    const entities = await this.eventModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return entities.map(EventMapper.toDomain);
  }

  async count(): Promise<number> {
    return this.eventModel.countDocuments();
  }
}
