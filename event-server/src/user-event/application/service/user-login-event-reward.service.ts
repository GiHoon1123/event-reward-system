import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PaginationMeta } from 'src/common/dto/paginated-response.dto';
import { PaginatedResult } from 'src/common/dto/paginated-result';
import { EventRepository } from 'src/event/infra/event.repository';
import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import { InMemoryLockManager } from 'src/user-event/infra/lock/in-memory-lock.manager';
import { RewardClaimHistoryRepository } from 'src/user-event/infra/reward-claim-history.repository';
import { RewardClaimLogRepository } from 'src/user-event/infra/reward-claim-log.repository';
import { UserLoginEventProgressRepository } from 'src/user-event/infra/user-login-event-progress.repository';
import { AvailableRewardResponse } from '../\bdto/available-reward.response';
import { RewardClaimLogResponse } from '../\bdto/reward-claim-log.response';
import { RequestRewardCommand } from '../command/request-reward.command';
import { GetAdminRewardHistoriesQuery } from '../query/get-admin-reward-histories.query';
import { GetAvailableRewardsQuery } from '../query/get-available-rewards.query';
import { GetUserRewardHistoriesQuery } from '../query/get-user-reward-histories.query';

@Injectable()
export class UserLoginEventRewardService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userLoginEventProgressRepository: UserLoginEventProgressRepository,
    private readonly rewardClaimHistoryRepository: RewardClaimHistoryRepository,
    private readonly rewardClaimLogRepository: RewardClaimLogRepository,
    private readonly lockManager: InMemoryLockManager,
  ) {}

  async requestReward(command: RequestRewardCommand): Promise<void> {
    const { eventId, email, rewardToClaim, requestId } = command;
    const reward = rewardToClaim;
    const lockKey = `reward-lock:${eventId}:${email}`;

    const lockAcquired = this.lockManager.acquire(lockKey);
    if (!lockAcquired) {
      throw new ConflictException(
        '이미 보상 처리 중입니다. 잠시 후 다시 시도해주세요.',
      );
    }

    try {
      const isDuplicated = await this.rewardClaimHistoryRepository.hasRequestId(
        eventId,
        email,
        requestId,
      );
      if (isDuplicated) {
        throw new ConflictException('이미 처리된 요청입니다.');
      }

      const event = await this.eventRepository.findActiveById(eventId);
      const definedReward = event.rewards.find((e) => e.name === reward.name);
      if (!definedReward) {
        const failure = RewardClaimHistory.failure(
          reward.name,
          reward.amount,
          '존재하지 않는 보상 이름입니다.',
          requestId,
        );
        await this.rewardClaimHistoryRepository.appendReward(
          eventId,
          email,
          failure,
        );
        await this.rewardClaimLogRepository.saveLog({
          email,
          eventId,
          rewardName: reward.name,
          amount: reward.amount,
          status: 'FAILURE',
          requestId,
          claimedAt: failure.claimedAt,
          reason: failure.reason,
        });
        throw new BadRequestException(
          `존재하지 않는 보상입니다: ${reward.name}`,
        );
      }

      const userProgress =
        await this.userLoginEventProgressRepository.findByUserEmail(email);
      if (!userProgress.isCompleted()) {
        const failure = RewardClaimHistory.failure(
          reward.name,
          reward.amount,
          '이벤트 미 완료',
          requestId,
        );
        await this.rewardClaimHistoryRepository.appendReward(
          eventId,
          email,
          failure,
        );
        await this.rewardClaimLogRepository.saveLog({
          email,
          eventId,
          rewardName: reward.name,
          amount: reward.amount,
          status: 'FAILURE',
          requestId,
          claimedAt: failure.claimedAt,
          reason: failure.reason,
        });
        throw new BadRequestException(
          '이벤트 완료 후에만 보상을 받을 수 있습니다.',
        );
      }

      const claimedAmount =
        await this.rewardClaimHistoryRepository.getClaimedAmount(
          eventId,
          email,
          reward.name,
        );
      const remaining = definedReward.amount - claimedAmount;

      if (reward.amount > remaining) {
        const failure = RewardClaimHistory.failure(
          reward.name,
          reward.amount,
          `보상 수량 초과: 요청 ${reward.amount}, 남은 ${remaining}`,
          requestId,
        );
        await this.rewardClaimHistoryRepository.appendReward(
          eventId,
          email,
          failure,
        );
        await this.rewardClaimLogRepository.saveLog({
          email,
          eventId,
          rewardName: reward.name,
          amount: reward.amount,
          status: 'FAILURE',
          requestId,
          claimedAt: failure.claimedAt,
          reason: failure.reason,
        });
        throw new BadRequestException(
          `보상 수량 초과: ${reward.name} (요청: ${reward.amount}, 남은: ${remaining})`,
        );
      }

      const success = RewardClaimHistory.success(
        reward.name,
        reward.amount,
        requestId,
      );
      await this.rewardClaimHistoryRepository.appendReward(
        eventId,
        email,
        success,
      );
      await this.rewardClaimLogRepository.saveLog({
        email,
        eventId,
        rewardName: reward.name,
        amount: reward.amount,
        status: 'SUCCESS',
        requestId,
        claimedAt: success.claimedAt,
      });
    } finally {
      this.lockManager.release(lockKey);
    }
  }

  async getAvailableRewards(
    query: GetAvailableRewardsQuery,
  ): Promise<AvailableRewardResponse[]> {
    const { eventId, email } = query;
    const userProgress =
      await this.userLoginEventProgressRepository.findByUserEmailOrThrow(email);

    if (!userProgress.isCompleted()) {
      throw new BadRequestException(`이벤트 완료 신청을 먼저 진행해 주세요`);
    }
    const event = await this.eventRepository.findActiveById(eventId);
    const histories =
      await this.rewardClaimHistoryRepository.findSuccessHistories(
        eventId,
        email,
      );

    return event.rewards.map((reward) => {
      const claimed = histories
        .filter((h) => h.rewardName === reward.name)
        .reduce((sum, h) => sum + h.amount, 0);
      const dto = new AvailableRewardResponse(
        reward.name,
        reward.type,
        Math.max(0, reward.amount - claimed),
      );
      return dto;
    });
  }

  async getUserHistoriesWithPage(
    query: GetUserRewardHistoriesQuery,
  ): Promise<PaginatedResult<RewardClaimLogResponse>> {
    const { email, page, limit } = query;

    const { items, totalCount } =
      await this.rewardClaimLogRepository.findByUserWithPage(
        email,
        page,
        limit,
      );

    const mapped = items.map((item) => new RewardClaimLogResponse(item));
    const meta = new PaginationMeta(page, limit, totalCount);

    return new PaginatedResult(mapped, meta);
  }

  async getHistoriesWithPage(
    query: GetAdminRewardHistoriesQuery,
  ): Promise<PaginatedResult<RewardClaimLogResponse>> {
    const { page, limit } = query;

    const { items, totalCount } =
      await this.rewardClaimLogRepository.findAllWithPage(page, limit);

    const mapped = items.map((item) => new RewardClaimLogResponse(item));
    const meta = new PaginationMeta(page, limit, totalCount);

    return new PaginatedResult(mapped, meta);
  }
}
