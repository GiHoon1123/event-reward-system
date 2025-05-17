import { BadRequestException, Injectable } from '@nestjs/common';
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
    const event = await this.eventRepository.findActiveById(command.eventId);

    const rewards = command.rewards.map((r) => Reward.create(r.name, r.amount));

    event.addRewards(rewards, command.requestedBy);
    await this.eventRepository.updateRewards(event.id, event.rewards);
  }

  async getAllEventsWithPage(
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

  async getRewardsByEventId(eventId: string): Promise<Event> {
    return this.eventRepository.findByIdOrThrow(eventId);
  }

  async getEventDetail(eventId: string) {
    return await this.eventRepository.findByIdOrThrow(eventId);
  }

  async changeStatus(
    eventId: string,
    to: 'ACTIVE' | 'INACTIVE',
    requestedBy: string,
  ): Promise<void> {
    const event = await this.eventRepository.findByIdOrThrow(eventId);
    if (event.createdBy != requestedBy) {
      throw new BadRequestException(
        `이벤트 상태 변경은 해당 이벤트를 등록한 유저만 가능합니다. (이벤트 등록 유저: ${event.createdBy})`,
      );
    }
    const updated =
      to === 'ACTIVE'
        ? event.markActive(requestedBy)
        : event.markInactive(requestedBy);

    await this.eventRepository.updateStatus(eventId, updated.status);
  }
}
