import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';

import { EventProgressInfo } from 'src/user-event/domain/event-progress-info';
import { UserEventProgress } from 'src/user-event/domain/user-event-progress';
import { UserEventProgressRepository } from 'src/user-event/infra/user-event-progress.repository';
import { IncreaseLoginCountCommand } from '../command/increase-login-count.command';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly userEventProgressRepository: UserEventProgressRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async increaseLoginCount(command: IncreaseLoginCountCommand): Promise<void> {
    const { email } = command;

    const existing =
      await this.userEventProgressRepository.findByUserEmail(email);
    const progress = existing
      ? existing
      : UserEventProgress.createInitial(email);

    if (existing) {
      progress.increase();
    }

    await this.userEventProgressRepository.save(progress);
  }

  async getProgressInfo(
    eventId: string,
    email: string,
  ): Promise<EventProgressInfo> {
    const event = await this.eventRepository.findActiveById(eventId);
    const userProgress =
      await this.userEventProgressRepository.findByUserEmailOrThrow(email);
    UserEventProgress.createInitial(email);
    return new EventProgressInfo(
      eventId,
      userProgress.getLoginCount(),
      event.condition.value,
    );
  }

  async markAsComplete(eventId: string, email: string): Promise<void> {
    const event = await this.eventRepository.findActiveById(eventId);
    const userProgress =
      await this.userEventProgressRepository.findByUserEmail(email);

    // 1. 조건 미달
    if (!userProgress || userProgress.getLoginCount() < event.condition.value) {
      const current = userProgress?.getLoginCount() ?? 0;
      const required = event.condition.value;
      const remaining = required - current;
      const rate = Math.floor((current / required) * 100); // 백분율
      throw new BadRequestException(
        `이벤트 조건을 만족하지 않았습니다. (진행도: ${rate}%, 총 ${required}회 중 ${current}회 완료, ${remaining}회 남음)`,
      );
    }

    if (userProgress.isCompleted()) {
      throw new BadRequestException(
        '이미 참여 완료한 이벤트입니다. 보상을 수령하세요',
      );
    }

    userProgress.markComplete();
    await this.userEventProgressRepository.save(userProgress);
  }
}
