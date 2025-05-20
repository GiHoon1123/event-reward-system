import { Event } from '../domain/event';
import { Reward, RewardType } from '../domain/reward';
import { EventEntity } from './event.entity';

export class EventMapper {
  static toEntity(event: Event): Record<string, any> {
    return {
      title: event.title,
      description: event.description,
      condition: {
        type: event.condition.type,
        value: event.condition.value,
      },
      status: event.status,
      rewards: event.rewards.map((r) => ({
        type: r.type,
        name: r.name,
        amount: r.amount,
      })),
      createdBy: event.createdBy,
      createdAt: event.createdAt,
    };
  }

  static toDomain(entity: EventEntity): Event {
    const rewards = (entity.rewards ?? []).map(
      (r) => new Reward(r.type as RewardType, r.name, r.amount),
    );

    return new Event(
      entity._id.toString(),
      entity.title,
      entity.description,
      {
        type: entity.condition.type as 'LOGIN_COUNT',
        value: entity.condition.value,
      },

      entity.status as 'ACTIVE' | 'INACTIVE',
      rewards,
      entity.createdBy,
      entity.createdAt,
    );
  }
}
