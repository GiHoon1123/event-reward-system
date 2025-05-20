import { Test, TestingModule } from '@nestjs/testing';
import { AvailableRewardResponse } from 'src/user-event/application/\bdto/available-reward.response';
import { RequestRewardCommand } from 'src/user-event/application/command/request-reward.command';
import { GetAvailableRewardsQuery } from 'src/user-event/application/query/get-available-rewards.query';
import { UserLoginEventRewardService } from 'src/user-event/application/service/user-login-event-reward.service';
import { ClaimRewardRequestDto } from 'src/user-event/web/dto/claim-reward.request';
import { UserRewardController } from 'src/user-event/web/user-reward.controller';

describe('UserRewardController', () => {
  let controller: UserRewardController;
  let service: UserLoginEventRewardService;

  const mockService = {
    requestReward: jest.fn(),
    getAvailableRewards: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRewardController],
      providers: [
        {
          provide: UserLoginEventRewardService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(UserRewardController);
    service = module.get(UserLoginEventRewardService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('requestReward', () => {
    it('보상 요청을 처리하고 성공 응답을 반환해야 한다', async () => {
      const eventId = 'event123';
      const email = 'user@example.com';
      const dto: ClaimRewardRequestDto = {
        requestId: 'req-123',
        name: '코어 잼스톤',
        amount: 100,
      };

      const response = await controller.requestReward(eventId, email, dto);

      expect(service.requestReward).toHaveBeenCalledWith(
        new RequestRewardCommand(eventId, email, dto.requestId, {
          name: dto.name,
          type: 'ITEM',
          amount: dto.amount,
        }),
      );
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('보상 요청이 성공 되었습니다.');
    });
  });

  describe('getAvailableRewards', () => {
    it('수령 가능 보상 목록을 반환해야 한다', async () => {
      const eventId = 'event123';
      const email = 'user@example.com';

      const rewards: AvailableRewardResponse[] = [
        new AvailableRewardResponse('코어 잼스톤', 'ITEM', 2),
        new AvailableRewardResponse('포션', 'ITEM', 0),
      ];

      mockService.getAvailableRewards.mockResolvedValue(rewards);

      const response = await controller.getAvailableRewards(eventId, email);

      expect(service.getAvailableRewards).toHaveBeenCalledWith(
        new GetAvailableRewardsQuery(eventId, email),
      );
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('남은 보상 목록 조회 성공');
      expect(response.data).toHaveLength(2);
    });
  });
});
