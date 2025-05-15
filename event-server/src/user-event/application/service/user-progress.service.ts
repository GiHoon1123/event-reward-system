import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';

import { EventProgressInfo } from 'src/user-event/domain/event-progress-info';
import { UserEventProgress } from 'src/user-event/domain/user-event-progress';
import { UserEventRepository } from 'src/user-event/infrastructure/user-event-progress.repository';
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

  async getProgressInfo(
    eventId: string,
    userEmail: string,
  ): Promise<EventProgressInfo> {
    const event = await this.eventRepository.findActiveById(eventId);
    const userProgress =
      (await this.userEventRepository.findByUserEmail(userEmail)) ??
      UserEventProgress.createInitial(userEmail);

    return new EventProgressInfo(
      eventId,
      userProgress.getLoginCount(),
      event.condition.value,
    );
  }

  async markAsComplete(eventId: string, email: string): Promise<void> {
    const event = await this.eventRepository.findActiveById(eventId);
    const progress = await this.userEventRepository.findByUserEmail(email);

    if (progress.getLoginCount() < event.condition.value) {
      throw new BadRequestException('아직 조건을 충족하지 않았습니다.');
    }

    if (progress.isCompleted()) {
      throw new BadRequestException(
        '이미 참여 완료한 이벤트입니다. 보상을 수령하세요',
      );
    }

    progress.markComplete();
    await this.userEventRepository.save(progress);
  }
}
