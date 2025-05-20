import { Test, TestingModule } from '@nestjs/testing';
import { EventDetailResponse } from 'src/event/application/dto/event-detail.response';
import { EventRewardResponse } from 'src/event/application/dto/event-rewards.response';
import { GetEventDetailQuery } from 'src/event/application/query/get-event-detail.query';
import { GetEventListQuery } from 'src/event/application/query/get-event-list.query';
import { GetEventRewardsQuery } from 'src/event/application/query/get-event-rewards.query';
import { EventService } from 'src/event/application/service/event.service';
import { PublicEventController } from 'src/event/web/public.event.controller';

describe('PublicEventController', () => {
  let controller: PublicEventController;
  let service: EventService;

  const mockEventService = {
    getAllEventsWithPage: jest.fn(),
    getEventDetail: jest.fn(),
    getRewardsByEventId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicEventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get(PublicEventController);
    service = module.get(EventService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getEvents', () => {
    it('이벤트 목록을 반환해야 한다', async () => {
      mockEventService.getAllEventsWithPage.mockResolvedValue({
        items: [],
        meta: {
          page: 1,
          limit: 10,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      });

      const response = await controller.getEvents(1, 10);

      expect(service.getAllEventsWithPage).toHaveBeenCalledWith(
        new GetEventListQuery(1, 10),
      );
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('이벤트 목록 조회 성공');
      expect(response.data).toEqual([]);
    });
  });

  describe('getEventDetail', () => {
    it('이벤트 상세 정보를 반환해야 한다', async () => {
      const dto = new EventDetailResponse({
        id: 'event123',
        title: '로그인 이벤트',
        description: '3번 로그인 시 보상',
        condition: { type: 'LOGIN_COUNT', value: 3 },
        status: 'ACTIVE',
        createdBy: 'admin@example.com',
        rewards: [],
      });

      mockEventService.getEventDetail.mockResolvedValue(dto);

      const response = await controller.getEventDetail('event123');

      expect(service.getEventDetail).toHaveBeenCalledWith(
        new GetEventDetailQuery('event123'),
      );
      expect(response.statusCode).toBe(200);
      expect(response.data.title).toBe('로그인 이벤트');
    });
  });

  describe('getRewardsByEventId', () => {
    it('이벤트 보상 목록을 반환해야 한다', async () => {
      const dto = new EventRewardResponse({
        eventId: 'event123',
        title: '보상 이벤트',
        rewards: [{ name: '포션', type: 'ITEM', amount: 100 }],
      });

      mockEventService.getRewardsByEventId.mockResolvedValue(dto);

      const response = await controller.getRewardsByEventId('event123');

      expect(service.getRewardsByEventId).toHaveBeenCalledWith(
        new GetEventRewardsQuery('event123'),
      );
      expect(response.statusCode).toBe(200);
      expect(response.data.rewards).toHaveLength(1);
    });
  });
});
