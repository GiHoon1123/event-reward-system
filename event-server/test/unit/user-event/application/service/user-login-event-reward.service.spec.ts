import { BadRequestException, ConflictException } from '@nestjs/common';
import { Event } from 'src/event/domain/event';
import { Reward } from 'src/event/domain/reward';
import { EventRepository } from 'src/event/infra/event.repository';
import { RequestRewardCommand } from 'src/user-event/application/command/request-reward.command';
import { GetAdminRewardHistoriesQuery } from 'src/user-event/application/query/get-admin-reward-histories.query';
import { GetAvailableRewardsQuery } from 'src/user-event/application/query/get-available-rewards.query';
import { GetUserRewardHistoriesQuery } from 'src/user-event/application/query/get-user-reward-histories.query';
import { UserLoginEventRewardService } from 'src/user-event/application/service/user-login-event-reward.service';
import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';
import { InMemoryLockManager } from 'src/user-event/infra/lock/in-memory-lock.manager';
import { RewardClaimHistoryRepository } from 'src/user-event/infra/reward-claim-history.repository';
import { RewardClaimLogRepository } from 'src/user-event/infra/reward-claim-log.repository';
import { UserLoginEventProgressRepository } from 'src/user-event/infra/user-login-event-progress.repository';

describe('UserLoginEventRewardService', () => {
  let service: UserLoginEventRewardService;
  let eventRepository: jest.Mocked<EventRepository>;
  let progressRepository: jest.Mocked<UserLoginEventProgressRepository>;
  let historyRepository: jest.Mocked<RewardClaimHistoryRepository>;
  let logRepository: jest.Mocked<RewardClaimLogRepository>;
  let lockManager: jest.Mocked<InMemoryLockManager>;

  beforeEach(() => {
    eventRepository = {
      findActiveById: jest.fn(),
    } as any;

    progressRepository = {
      findByUserEmail: jest.fn(),
      findByUserEmailOrThrow: jest.fn(),
    } as any;

    historyRepository = {
      hasRequestId: jest.fn(),
      appendReward: jest.fn(),
      getClaimedAmount: jest.fn(),
      findSuccessHistories: jest.fn(),
    } as any;

    logRepository = {
      saveLog: jest.fn(),
      findByUserWithPage: jest.fn(),
      findAllWithPage: jest.fn(),
    } as any;

    lockManager = {
      acquire: jest.fn(),
      release: jest.fn(),
      isLocked: jest.fn(),
    } as any;

    service = new UserLoginEventRewardService(
      eventRepository,
      progressRepository,
      historyRepository,
      logRepository,
      lockManager,
    );
  });

  function setupEventWithRewards(amount: number): Event {
    const event = Event.of(
      '제목',
      '설명',
      'LOGIN_COUNT',
      1,
      'admin@example.com',
    );
    Object.defineProperty(event, 'rewards', {
      value: [Reward.create('포션', amount)],
      writable: false,
    });
    return event;
  }

  describe('requestReward', () => {
    it('락 획득 실패 시 ConflictException 발생', async () => {
      lockManager.acquire.mockReturnValue(false); // 락 실패

      const command = new RequestRewardCommand(
        'event1',
        'user@example.com',
        'req1',
        { name: '포션', type: 'ITEM', amount: 1 },
      );

      await expect(service.requestReward(command)).rejects.toThrow(
        ConflictException,
      );
    });

    it('정상 흐름에서 release가 호출되어야 한다', async () => {
      lockManager.acquire.mockReturnValue(true);

      const event = Event.of(
        '테스트 이벤트',
        '보상 테스트',
        'LOGIN_COUNT',
        1,
        'admin@example.com',
      );

      // 보상 수동 추가
      Object.defineProperty(event, 'rewards', {
        value: [Reward.create('포션', 10)],
        writable: false,
      });

      eventRepository.findActiveById.mockResolvedValue(event);
      historyRepository.hasRequestId.mockResolvedValue(false);
      progressRepository.findByUserEmail.mockResolvedValue({
        isCompleted: () => true,
      } as any);
      historyRepository.getClaimedAmount.mockResolvedValue(0);

      const command = new RequestRewardCommand(
        event.id,
        'user@example.com',
        'req1',
        { name: '포션', type: 'ITEM', amount: 1 },
      );

      await service.requestReward(command);

      expect(lockManager.release).toHaveBeenCalledWith(
        `reward-lock:${command.eventId}:${command.email}`,
      );
    });

    it('중복된 requestId가 있으면 ConflictException 발생', async () => {
      lockManager.acquire.mockReturnValue(true);
      historyRepository.hasRequestId.mockResolvedValue(true);
      const command = new RequestRewardCommand(
        'event1',
        'user@example.com',
        'req1',
        { name: '포션', type: 'ITEM', amount: 1 },
      );
      await expect(service.requestReward(command)).rejects.toThrow(
        ConflictException,
      );
    });

    it('정의되지 않은 보상 이름이면 예외 발생', async () => {
      lockManager.acquire.mockReturnValue(true);
      const event = setupEventWithRewards(5);
      historyRepository.hasRequestId.mockResolvedValue(false);
      eventRepository.findActiveById.mockResolvedValue(event);

      const command = new RequestRewardCommand(
        event.id,
        'user@example.com',
        'req2',
        { name: '없는보상', type: 'ITEM', amount: 1 },
      );

      await expect(service.requestReward(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('이벤트 완료되지 않은 경우 예외 발생', async () => {
      lockManager.acquire.mockReturnValue(true);
      const event = setupEventWithRewards(5);
      const progress = UserLoginEventProgress.createInitial('user@example.com');

      historyRepository.hasRequestId.mockResolvedValue(false);
      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new RequestRewardCommand(
        event.id,
        'user@example.com',
        'req3',
        { name: '포션', type: 'ITEM', amount: 1 },
      );

      await expect(service.requestReward(command)).rejects.toThrow(
        '이벤트 완료 후에만 보상을 받을 수 있습니다.',
      );
    });

    it('보상 수량 초과 요청 시 예외 발생', async () => {
      lockManager.acquire.mockReturnValue(true);
      const event = setupEventWithRewards(2);
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progress.increase();
      progress.markComplete();

      historyRepository.hasRequestId.mockResolvedValue(false);
      historyRepository.getClaimedAmount.mockResolvedValue(2); // 전부 수령된 상태
      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new RequestRewardCommand(
        event.id,
        'user@example.com',
        'req4',
        { name: '포션', type: 'ITEM', amount: 1 },
      );

      await expect(service.requestReward(command)).rejects.toThrow(
        /보상 수량 초과/,
      );
    });

    it('정상적으로 보상을 요청하면 저장 로직이 호출된다', async () => {
      lockManager.acquire.mockReturnValue(true);
      const event = setupEventWithRewards(3);
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progress.increase();
      progress.markComplete();

      historyRepository.hasRequestId.mockResolvedValue(false);
      historyRepository.getClaimedAmount.mockResolvedValue(0);
      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new RequestRewardCommand(
        event.id,
        'user@example.com',
        'req5',
        { name: '포션', type: 'ITEM', amount: 1 },
      );

      await service.requestReward(command);

      expect(historyRepository.appendReward).toHaveBeenCalled();
      expect(logRepository.saveLog).toHaveBeenCalled();
    });
  });

  describe('getAvailableRewards', () => {
    it('조건을 만족하지 않으면 예외 발생', async () => {
      const query = new GetAvailableRewardsQuery('event1', 'user@example.com');
      const progress = UserLoginEventProgress.createInitial('user@example.com');

      progressRepository.findByUserEmailOrThrow.mockResolvedValue(progress);

      await expect(service.getAvailableRewards(query)).rejects.toThrow(
        '이벤트 완료 신청을 먼저 진행해 주세요',
      );
    });

    it('완료된 유저에게 남은 보상 목록을 반환', async () => {
      const query = new GetAvailableRewardsQuery('event1', 'user@example.com');
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progress.increase();
      progress.markComplete();

      const event = setupEventWithRewards(5);
      progressRepository.findByUserEmailOrThrow.mockResolvedValue(progress);
      eventRepository.findActiveById.mockResolvedValue(event);
      historyRepository.findSuccessHistories.mockResolvedValue([
        {
          rewardName: '포션',
          amount: 2,
          status: 'SUCCESS',
          requestId: 'mock-req-id',
          claimedAt: new Date(),
        },
      ]);

      const result = await service.getAvailableRewards(query);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('포션');
      expect(result[0].availableAmount).toBe(3);
    });
  });

  describe('getUserHistoriesWithPage', () => {
    it('유저 보상 이력을 페이지로 반환', async () => {
      const query = new GetUserRewardHistoriesQuery('user@example.com', 1, 10);

      logRepository.findByUserWithPage.mockResolvedValue({
        items: [
          {
            eventId: 'event1',
            email: 'user@example.com',
            rewardName: '포션',
            amount: 1,
            status: 'SUCCESS',
            claimedAt: new Date(),
            requestId: 'req-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            _id: 'dummy-id',
          } as any,
        ],
        totalCount: 1,
      });

      const result = await service.getUserHistoriesWithPage(query);

      expect(result.items).toHaveLength(1);
      expect(result.meta.totalCount).toBe(1);
    });
  });

  describe('getHistoriesWithPage', () => {
    it('어드민 보상 이력을 페이지로 반환', async () => {
      const query = new GetAdminRewardHistoriesQuery(1, 10);

      logRepository.findAllWithPage.mockResolvedValue({
        items: [
          {
            eventId: 'event1',
            email: 'admin@example.com',
            rewardName: '포션',
            amount: 1,
            status: 'SUCCESS',
            claimedAt: new Date(),
          } as any, // 타입 무시
        ],
        totalCount: 1,
      });

      const result = await service.getHistoriesWithPage(query);

      expect(result.items).toHaveLength(1);
      expect(result.meta.totalCount).toBe(1);
    });
  });
});
