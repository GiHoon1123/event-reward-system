import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from 'src/event/application/service/event.service';
import { AdminEventController } from 'src/event/web/admin.event.controller';
import { ChangeEventStatusRequestDto } from 'src/event/web/dto/change-event-status.request';
import { CreateEventRequestDto } from 'src/event/web/dto/create-event.request';
import { EventRewardRequestDto } from 'src/event/web/dto/event-reward.request';

describe('AdminEventController', () => {
  let controller: AdminEventController;
  let service: EventService;

  const mockEventService = {
    createEvent: jest.fn(),
    addRewards: jest.fn(),
    changeStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get(AdminEventController);
    service = module.get(EventService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createEvent', () => {
    it('이벤트 생성 후 성공 응답을 반환해야 한다', async () => {
      const dto: CreateEventRequestDto = {
        title: '출석 체크 이벤트',
        description: '3일 연속 로그인 시 보상 지급',
        conditionType: 'LOGIN_COUNT',
        conditionValue: 3,
        startAt: '2025-05-20T00:00:00Z',
        endAt: '2025-06-01T23:59:59Z',
      };
      const email = 'admin@example.com';

      const response = await controller.createEvent(dto, email);

      expect(service.createEvent).toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('이벤트가 성공적으로 등록되었습니다.');
    });
  });

  describe('addRewards', () => {
    it('이벤트에 보상 등록 후 성공 응답을 반환해야 한다', async () => {
      const eventId = 'event123';
      const email = 'admin@example.com';
      const rewards: EventRewardRequestDto[] = [
        { type: 'ITEM', name: '포션', amount: 100 },
        { type: 'ITEM', name: '골드', amount: 200 },
      ];

      const response = await controller.addRewards(eventId, rewards, email);

      expect(service.addRewards).toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe('보상이 성공적으로 등록되었습니다.');
    });
  });

  describe('changeStatus', () => {
    it('이벤트 상태 변경 후 성공 응답을 반환해야 한다', async () => {
      const eventId = 'event456';
      const email = 'admin@example.com';
      const dto: ChangeEventStatusRequestDto = { status: 'INACTIVE' };

      const response = await controller.changeStatus(eventId, email, dto);

      expect(service.changeStatus).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('이벤트 상태가 INACTIVE로 변경되었습니다.');
    });
  });
});
