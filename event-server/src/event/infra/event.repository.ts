import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InactiveEventException } from 'src/common/exception/custom/inactive-event.exception';
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

  async findById(eventId: string): Promise<Event | null> {
    const entity = await this.eventModel.findById(eventId).exec();
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findByIdOrThrow(eventId: string): Promise<Event | null> {
    const entity = await this.eventModel.findById(eventId).exec();
    if (entity == null) {
      throw new NotFoundException(
        `이벤트가 존재하지 않습니다. (id: ${eventId})`,
      );
    }
    return EventMapper.toDomain(entity);
  }

  async findActiveByType(type: string): Promise<Event | null> {
    const entity = await this.eventModel
      .findOne({ 'condition.type': type, status: 'ACTIVE' })
      .exec();

    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findActiveById(eventId: string): Promise<Event> {
    const entity = await this.eventModel.findById(eventId);

    if (!entity) {
      throw new NotFoundException(
        `이벤트가 존재하지 않습니다. (id: ${eventId})`,
      );
    }
    if (entity.status !== 'ACTIVE') {
      throw new InactiveEventException();
    }

    return EventMapper.toDomain(entity);
  }

  async findAll(): Promise<Event[]> {
    const list = await this.eventModel.find().exec();
    return list.map(EventMapper.toDomain);
  }

  async findLoginCountEvent(): Promise<Event> {
    const entity = await this.eventModel
      .findOne({ 'condition.type': 'LOGIN_COUNT' })
      .exec();

    return entity ? EventMapper.toDomain(entity) : null;
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

  async updateStatus(
    eventId: string,
    status: 'ACTIVE' | 'INACTIVE',
  ): Promise<void> {
    await this.eventModel
      .updateOne({ _id: eventId }, { $set: { status } })
      .exec();
  }
}
