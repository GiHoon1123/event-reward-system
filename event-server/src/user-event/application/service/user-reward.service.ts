import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EventRepository } from 'src/event/infra/event.repository';
import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import { RewardClaimHistoryRepository } from 'src/user-event/infra/reward-claim-history.repository';
import { UserEventProgressRepository } from 'src/user-event/infra/user-event-progress.repository';
import { RequestRewardCommand } from '../command/request-reward.command';

@Injectable()
export class UserRewardService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userEventProgressRepository: UserEventProgressRepository,
    private readonly rewardClaimHistoryRepository: RewardClaimHistoryRepository,
  ) {}

  async requestReward(command: RequestRewardCommand): Promise<void> {
    const { eventId, email, rewardToClaim, requestId } = command;
    const reward = rewardToClaim; // 단일 요청 기준

    const event = await this.eventRepository.findActiveById(eventId);

    // 1. 보상 존재 여부 먼저 확인
    const definedReward = event.rewards.find((e) => e.name === reward.name);
    if (!definedReward) {
      const failure = RewardClaimHistory.failure(
        eventId,
        email,
        reward.name,
        reward.amount,
        '존재하지 않는 보상 이름입니다.',
        requestId,
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(`존재하지 않는 보상입니다: ${reward.name}`);
    }

    // 2. 진행도 확인
    const userProgress =
      await this.userEventProgressRepository.findByUserEmail(email);
    if (!userProgress.isCompleted()) {
      const failure = RewardClaimHistory.failure(
        eventId,
        email,
        reward.name,
        reward.amount,
        `이벤트 미 완료 `,
        requestId,
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(
        '이벤트 완료 후에만 보상을 받을 수 있습니다.',
      );
    }

    // 3. 이미 수령한 수량 계산
    const alreadyClaimed =
      await this.rewardClaimHistoryRepository.findByEventAndUserSuccessOnly(
        eventId,
        email,
      );
    const claimedAmount = alreadyClaimed
      .filter((h) => h.rewardName === reward.name)
      .reduce((sum, h) => sum + h.amount, 0);
    const remaining = definedReward.amount - claimedAmount;

    // 4. 초과 요청 여부 확인
    if (reward.amount > remaining) {
      const failure = RewardClaimHistory.failure(
        eventId,
        email,
        reward.name,
        reward.amount,
        `보상 수량 초과: 요청 ${reward.amount}, 남은 ${remaining}`,
        requestId,
      );
      await this.rewardClaimHistoryRepository.save(failure);
      throw new BadRequestException(
        `보상 수량 초과: ${reward.name} (요청: ${reward.amount}, 남은: ${remaining})`,
      );
    }

    // 5. 최종 수령 처리
    const success = RewardClaimHistory.success(
      eventId,
      email,
      reward.name,
      reward.amount,
      requestId,
    );

    try {
      await this.rewardClaimHistoryRepository.save(success);
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('이미 처리된 요청입니다.');
      }
      throw err;
    }
  }

  async getAvailableRewards(
    eventId: string,
    email: string,
  ): Promise<
    {
      name: string;
      type: string;
      availableAmount: number;
    }[]
  > {
    const userProgress =
      await this.userEventProgressRepository.findByUserEmailOrThrow(email);

    if (!userProgress.isCompleted) {
      throw new BadRequestException(`이벤트 완료 신청을 먼저 진행해 주세요`);
    }
    const event = await this.eventRepository.findActiveById(eventId);
    const histories =
      await this.rewardClaimHistoryRepository.findByEventAndUserSuccessOnly(
        eventId,
        email,
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
