// src/user-event/application/service/reward-request.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';
import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import { RewardClaimHistoryRepository } from 'src/user-event/infrastructure/reward-claim-history.repository';
import { UserEventRepository } from 'src/user-event/infrastructure/user-event.repository';
import { RequestRewardCommand } from '../command/request-reward.command';

@Injectable()
export class RewardService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userEventRepository: UserEventRepository,
    private readonly rewardClaimHistoryRepository: RewardClaimHistoryRepository,
  ) {}
  async requestReward(command: RequestRewardCommand): Promise<void> {
    const { eventId, userEmail, rewardsToClaim } = command;
    const reward = rewardsToClaim[0]; // 단일 요청이므로 첫 번째 하나만 처리

    const event = await this.eventRepository.findById(eventId);
    const userProgress =
      await this.userEventRepository.findByUserEmail(userEmail);

    // 1. 조건 미달
    if (!userProgress || userProgress.getLoginCount() < event.condition.value) {
      const current = userProgress?.getLoginCount() ?? 0;
      const required = event.condition.value;
      const remaining = required - current;
      const rate = Math.floor((current / required) * 100); // 백분율

      const failure = RewardClaimHistory.failure(
        eventId,
        userEmail,
        reward.name,
        reward.amount,
        `이벤트 조건 불충족 (${current}/${required})`,
      );
      await this.rewardClaimHistoryRepository.save(failure);

      throw new BadRequestException(
        `이벤트 조건을 만족하지 않았습니다. (진행도: ${rate}%, 총 ${required}회 중 ${current}회 완료, ${remaining}회 남음)`,
      );
    }

    // 2. 존재하지 않는 보상
    const definedReward = event.rewards.find((e) => e.name === reward.name);
    if (!definedReward) {
      const failure = RewardClaimHistory.failure(
        eventId,
        userEmail,
        reward.name,
        reward.amount,
        '존재하지 않는 보상 이름입니다.',
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(`존재하지 않는 보상입니다: ${reward.name}`);
    }

    // 3. 성공 이력 기반 수령 여부 확인
    const alreadyClaimed =
      await this.rewardClaimHistoryRepository.findByEventAndUserSuccessOnly(
        eventId,
        userEmail,
      );

    const claimedAmount = alreadyClaimed
      .filter((h) => h.rewardName === reward.name)
      .reduce((sum, h) => sum + h.amount, 0);

    const remaining = definedReward.amount - claimedAmount;

    // 4. 수량 초과 요청
    if (reward.amount > remaining) {
      const failure = RewardClaimHistory.failure(
        eventId,
        userEmail,
        reward.name,
        reward.amount,
        `보상 수량 초과: 요청 ${reward.amount}, 남은 ${remaining}`,
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(
        `보상 수량 초과: ${reward.name} (요청: ${reward.amount}, 남은: ${remaining})`,
      );
    }

    // 5. 정상 수령 처리
    const success = RewardClaimHistory.success(
      eventId,
      userEmail,
      reward.name,
      reward.amount,
    );
    await this.rewardClaimHistoryRepository.save(success);
  }

  async getAvailableRewards(
    eventId: string,
    userEmail: string,
  ): Promise<
    {
      name: string;
      type: string;
      availableAmount: number;
    }[]
  > {
    const event = await this.eventRepository.findById(eventId);
    const histories =
      await this.rewardClaimHistoryRepository.findByEventAndUserSuccessOnly(
        eventId,
        userEmail,
      );

    return event.rewards.map((reward) => {
      const claimed = histories
        .filter((h) => h.rewardName === reward.name)
        .reduce((sum, h) => sum + h.amount, 0);

      return {
        name: reward.name,
        type: reward.type,
        availableAmount: Math.max(0, reward.amount - claimed),
      };
    });
  }

  async getUserHistoriesWithPage(email: string, page: number, limit: number) {
    return this.rewardClaimHistoryRepository.findByUserWithPage(
      email,
      page,
      limit,
    );
  }

  async getAdminHistoriesWithPage(
    filters: {
      userEmail?: string;
      eventId?: string;
      status?: 'SUCCESS' | 'FAILURE';
      rewardId?: string; // 필요 시 확장 가능
    },
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimHistory[] }> {
    return this.rewardClaimHistoryRepository.findByAdminWithFilters(
      filters,
      page,
      limit,
    );
  }
}
