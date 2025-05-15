import { Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';

import { EventProgressInfo } from 'src/user-event/domain/event-progress-info';
import { UserEventProgress } from 'src/user-event/domain/user-event-progress';
import { UserEventRepository } from 'src/user-event/infrastructure/user-event.repository';
import { IncreaseLoginCountCommand } from '../command/increase-login-count.command';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly userEventRepository: UserEventRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async increaseLoginCount(command: IncreaseLoginCountCommand): Promise<void> {
    const { userEmail } = command;

    const existing = await this.userEventRepository.findByUserEmail(userEmail);
    const progress = existing
      ? existing
      : UserEventProgress.createInitial(userEmail);

    if (existing) {
      progress.increase(); // 기존이면 증가
    }

    await this.userEventRepository.save(progress);
  }

  /**
   * 유저가 특정 이벤트 조건을 만족했는지 확인
   * @param eventId 이벤트 ID
   * @param userEmail 유저 이메일
   */
  async hasMetCondition(eventId: string, userEmail: string): Promise<boolean> {
    const event = await this.eventRepository.findById(eventId);
    const userProgress =
      (await this.userEventRepository.findByUserEmail(userEmail)) ??
      UserEventProgress.createInitial(userEmail);

    // 현재 시스템에서는 LOGIN_COUNT 조건으로 고정되어 있음
    const currentLoginCount = userProgress.getLoginCount();
    const requiredCount = event.condition.value;

    return currentLoginCount >= requiredCount;
  }

  async getProgressInfo(
    eventId: string,
    userEmail: string,
  ): Promise<EventProgressInfo> {
    const event = await this.eventRepository.findById(eventId);
    const userProgress =
      (await this.userEventRepository.findByUserEmail(userEmail)) ??
      UserEventProgress.createInitial(userEmail);

    return new EventProgressInfo(
      eventId,
      userProgress.getLoginCount(),
      event.condition.value,
    );
  }
}
