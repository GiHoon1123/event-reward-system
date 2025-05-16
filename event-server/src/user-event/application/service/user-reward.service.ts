import { BadRequestException, Injectable } from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';
import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import { RewardClaimHistoryRepository } from 'src/user-event/infra/reward-claim-history.repository';
import { UserEventRepository } from 'src/user-event/infra/user-event-progress.repository';
import { RequestRewardCommand } from '../command/request-reward.command';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userEventRepository: UserEventRepository,
    private readonly rewardClaimHistoryRepository: RewardClaimHistoryRepository,
  ) {}

  async requestReward(command: RequestRewardCommand): Promise<void> {
    const { eventId, userEmail, rewardsToClaim } = command;
    const reward = rewardsToClaim[0]; // 단일 요청이므로 첫 번째 하나만 처리

    const event = await this.eventRepository.findActiveById(eventId);
    const userProgress =
      await this.userEventRepository.findByUserEmail(userEmail);

    if (!userProgress.isCompleted()) {
      const failure = RewardClaimHistory.failure(
        eventId,
        userEmail,
        reward.name,
        reward.amount,
        `이벤트 미 완료 `,
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(
        '이벤트 완료 후에만 보상을 받을 수 있습니다.',
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
    const userProgress =
      await this.userEventRepository.findByUserEmailOrThrow(userEmail);

    if (!userProgress.isCompleted) {
      throw new BadRequestException(`이벤트 완료 신청을 먼저 진행해 주세요`);
    }
    const event = await this.eventRepository.findActiveById(eventId);
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

  async getHistoriesWithPage(
    page: number,
    limit: number,
  ): Promise<{ totalCount: number; items: RewardClaimHistory[] }> {
    return this.rewardClaimHistoryRepository.findAllWithPage(page, limit);
  }
}
