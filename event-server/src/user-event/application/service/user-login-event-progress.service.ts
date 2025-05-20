import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';

import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';
import { UserLoginEventProgressRepository } from 'src/user-event/infra/user-login-event-progress.repository';
import { UserLoginEventProgressInfoResponse } from '../\bdto/user-login-event-progress-info.response';
import { CompleteLoginEventCommand } from '../command/complete-login-event.command';
import { IncreaseLoginCountCommand } from '../command/increase-login-count.command';
import { GetProgressInfoQuery } from '../query/get-progress-info-query';

@Injectable()
export class UserLoginEventProgressService {
  constructor(
    private readonly userLoginEventProgressRepository: UserLoginEventProgressRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async increaseLoginCount(command: IncreaseLoginCountCommand): Promise<void> {
    const isLoginCountEvent = await this.eventRepository.findLoginCountEvent();
    if (!isLoginCountEvent) {
      return;
    }

    const { email } = command;

    const existing =
      await this.userLoginEventProgressRepository.findByUserEmail(email);
    const progress = existing
      ? existing
      : UserLoginEventProgress.createInitial(email);

    if (existing) {
      progress.increase();
    }

    await this.userLoginEventProgressRepository.save(progress);
  }

  async getProgressInfo(
    query: GetProgressInfoQuery,
  ): Promise<UserLoginEventProgressInfoResponse> {
    const { eventId, email } = query;
    const event = await this.eventRepository.findActiveById(eventId);
    let userProgress =
      await this.userLoginEventProgressRepository.findByUserEmail(email);

    if (!userProgress) {
      userProgress = UserLoginEventProgress.createInitial(email);
      await this.userLoginEventProgressRepository.save(userProgress);
    }
    const dto = new UserLoginEventProgressInfoResponse(
      eventId,
      userProgress.getLoginCount(),
      event.condition.value,
    );
    return dto;
  }

  async markAsComplete(command: CompleteLoginEventCommand): Promise<void> {
    const { eventId, email } = command;
    const event = await this.eventRepository.findActiveById(eventId);
    const userProgress =
      await this.userLoginEventProgressRepository.findByUserEmail(email);

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
    await this.userLoginEventProgressRepository.save(userProgress);
  }
}
