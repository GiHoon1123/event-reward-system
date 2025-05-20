import { Test, TestingModule } from '@nestjs/testing';
import { PaginationMeta } from 'src/common/dto/paginated-response.dto';
import { PaginatedResult } from 'src/common/dto/paginated-result';
import { RewardClaimLogResponse } from 'src/user-event/application/\bdto/reward-claim-log.response';
import { UserLoginEventRewardService } from 'src/user-event/application/service/user-login-event-reward.service';
import { UserRewardHistoryController } from 'src/user-event/web/user-reward-history.controller';

describe('UserRewardHistoryController', () => {
  let controller: UserRewardHistoryController;
  let service: UserLoginEventRewardService;

  const mockService = {
    getUserHistoriesWithPage: jest.fn(),
    getHistoriesWithPage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRewardHistoryController],
      providers: [
        {
          provide: UserLoginEventRewardService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(UserRewardHistoryController);
    service = module.get(UserLoginEventRewardService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getUserHistoriesWithPage', () => {
    it('유저의 보상 이력을 페이지로 조회해야 한다', async () => {
      const mockResponse = new PaginatedResult<RewardClaimLogResponse>(
        [
          new RewardClaimLogResponse({
            eventId: 'event1',
            email: 'user@example.com',
            rewardName: '포션',
            amount: 100,
            status: 'SUCCESS',
            claimedAt: new Date('2025-05-16T00:00:00Z'),
          }),
        ],
        new PaginationMeta(1, 20, 1),
      );

      mockService.getUserHistoriesWithPage.mockResolvedValue(mockResponse);

      const response = await controller.getUserHistoriesWithPage(
        'user@example.com',
        1,
        20,
      );

      expect(service.getUserHistoriesWithPage).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('보상 이력 조회 성공');
      expect(response.data.length).toBe(1);
    });
  });

  describe('getAHistoriesWithPage', () => {
    it('관리자가 전체 보상 이력을 페이지로 조회해야 한다', async () => {
      const mockResponse = new PaginatedResult<RewardClaimLogResponse>(
        [
          new RewardClaimLogResponse({
            eventId: 'event1',
            email: 'admin@example.com',
            rewardName: '코어 잼스톤',
            amount: 100,
            status: 'FAILURE',
            reason: '이벤트 미 완료',
            claimedAt: new Date('2025-05-16T01:00:00Z'),
          }),
        ],
        new PaginationMeta(1, 20, 1),
      );

      mockService.getHistoriesWithPage.mockResolvedValue(mockResponse);

      const response = await controller.getAHistoriesWithPage(1, 20);

      expect(service.getHistoriesWithPage).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('어드민 보상 이력 조회 성공');
      expect(response.data.length).toBe(1);
    });
  });
});
