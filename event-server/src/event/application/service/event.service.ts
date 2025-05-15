import { Injectable, NotFoundException } from '@nestjs/common';
import { Reward } from 'src/event/domain/reward';
import { EventRepository } from 'src/event/infra/event.repository';
import { Event } from '../../domain/event';
import { AddRewardsCommand } from '../command/add-rewards.command';
import { CreateEventCommand } from '../command/create-event.command';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(command: CreateEventCommand): Promise<string> {
    const event = Event.of(
      command.title,
      command.description,
      command.conditionValue,
      command.createdBy,
    );
    const saved = await this.eventRepository.save(event);
    return saved.id;
  }

  async addRewards(command: AddRewardsCommand): Promise<void> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');

    const rewards = command.rewards.map((r) => Reward.create(r.name, r.amount));

    event.addRewards(rewards, command.requestedBy);
    await this.eventRepository.updateRewards(event.id, event.rewards);
  }

  async findAllWithPage(
    page: number,
    limit: number,
  ): Promise<{
    totalCount: number;
    items: Event[];
  }> {
    const [items, totalCount] = await Promise.all([
      this.eventRepository.findByPage(page, limit),
      this.eventRepository.count(),
    ]);
    return { totalCount, items };
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    return event;
  }
}
