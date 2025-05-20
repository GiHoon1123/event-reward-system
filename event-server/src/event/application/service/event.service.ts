import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PaginationMeta } from 'src/common/dto/paginated-response.dto';
import { Reward } from 'src/event/domain/reward';
import { EventRepository } from 'src/event/infra/event.repository';
import { PaginatedResult } from '../../../common/dto/paginated-result';
import { Event } from '../../domain/event';
import { AddRewardsCommand } from '../command/add-rewards.command';
import { CreateEventCommand } from '../command/create-event.command';
import { EventStatusChangeCommand } from '../command/event-status-chagne-command';
import { EventDetailResponse } from '../dto/event-detail.response';
import { EventListResponse } from '../dto/event-list.response';
import { EventRewardResponse, RewardItem } from '../dto/event-rewards.response';
import { GetEventDetailQuery } from '../query/get-event-detail.query';
import { GetEventListQuery } from '../query/get-event-list.query';
import { GetEventRewardsQuery } from '../query/get-event-rewards.query';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(command: CreateEventCommand): Promise<string> {
    const existingActiveEventOfType =
      await this.eventRepository.findActiveByType(command.conditionType);

    if (existingActiveEventOfType) {
      throw new ConflictException(
        `${command.conditionType} 타입의 이벤트는 이미 활성화되어 있습니다. 하나의 조건 타입에 대해 하나의 이벤트만 등록할 수 있습니다.`,
      );
    }

    const event = Event.of(
      command.title,
      command.description,
      command.conditionType,
      command.conditionValue,
      command.createdBy,
    );

    const saved = await this.eventRepository.save(event);
    return saved.id;
  }

  async addRewards(command: AddRewardsCommand): Promise<void> {
    const event = await this.eventRepository.findActiveById(command.eventId);

    if (event.createdBy !== command.requestedBy) {
      throw new BadRequestException(
        `이벤트 상태 변경은 해당 이벤트를 등록한 유저만 가능합니다. (이벤트 등록 유저: ${event.createdBy})`,
      );
    }

    const existingNames = new Set(event.rewards.map((r) => r.name));

    const duplicatedNames = command.rewards
      .map((r) => r.name)
      .filter((name, index, self) => self.indexOf(name) === index)
      .filter((name) => existingNames.has(name));

    if (duplicatedNames.length > 0) {
      throw new BadRequestException(
        `다음 보상 이름은 이미 등록되어 있습니다: ${duplicatedNames.join(', ')}`,
      );
    }

    const rewards = command.rewards.map((r) => Reward.create(r.name, r.amount));
    event.addRewards(rewards, command.requestedBy);

    await this.eventRepository.updateRewards(event.id, event.rewards);
  }

  async getAllEventsWithPage(
    query: GetEventListQuery,
  ): Promise<PaginatedResult<EventListResponse>> {
    const { page, limit } = query;
    const [items, totalCount] = await Promise.all([
      this.eventRepository.findByPage(page, limit),
      this.eventRepository.count(),
    ]);

    const dto = items.map((event) => new EventListResponse(event));

    return new PaginatedResult(
      dto,
      new PaginationMeta(page, limit, totalCount),
    );
  }

  async getRewardsByEventId(
    query: GetEventRewardsQuery,
  ): Promise<EventRewardResponse> {
    const { eventId } = query;
    const event = await this.eventRepository.findByIdOrThrow(eventId);

    return new EventRewardResponse({
      eventId: event.id,
      title: event.title,
      rewards: event.rewards.map(
        (r) =>
          new RewardItem({
            name: r.name,
            type: r.type,
            amount: r.amount,
          }),
      ),
    });
  }

  async getEventDetail(query: GetEventDetailQuery) {
    const { eventId } = query;
    const event = await this.eventRepository.findByIdOrThrow(eventId);
    const dto = new EventDetailResponse(event);
    return dto;
  }

  async changeStatus(command: EventStatusChangeCommand): Promise<void> {
    const { eventId, status, email } = command;
    const event = await this.eventRepository.findByIdOrThrow(eventId);
    if (event.createdBy != email) {
      throw new BadRequestException(
        `이벤트 상태 변경은 해당 이벤트를 등록한 유저만 가능합니다. (이벤트 등록 유저: ${event.createdBy})`,
      );
    }
    const updated =
      status === 'ACTIVE' ? event.markActive(email) : event.markInactive(email);

    await this.eventRepository.updateStatus(eventId, updated.status);
  }
}
