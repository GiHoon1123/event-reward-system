import { Test, TestingModule } from '@nestjs/testing';
import { UserLoginEventProgressInfoResponse } from 'src/user-event/application/\bdto/user-login-event-progress-info.response';
import { UserLoginEventProgressService } from 'src/user-event/application/service/user-login-event-progress.service';
import { UserProgressController } from 'src/user-event/web/user-progress.controller';

describe('UserProgressController', () => {
  let controller: UserProgressController;
  let service: UserLoginEventProgressService;

  const mockService = {
    increaseLoginCount: jest.fn(),
    getProgressInfo: jest.fn(),
    markAsComplete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProgressController],
      providers: [
        {
          provide: UserLoginEventProgressService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(UserProgressController);
    service = module.get(UserLoginEventProgressService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('increaseLoginCount', () => {
    it('유저의 로그인 횟수를 증가시키고 성공 응답을 반환해야 한다', async () => {
      const response = await controller.increaseLoginCount('user@example.com');

      expect(service.increaseLoginCount).toHaveBeenCalled();
      expect(response.statusCode).toBe(201);
      expect(response.message).toBe(
        '유저의 로그인 이벤트 진행도가 증가했습니다.',
      );
    });
  });

  describe('getProgress', () => {
    it('유저의 이벤트 진행도를 반환해야 한다', async () => {
      const eventId = 'event123';
      const email = 'user@example.com';

      const dto = new UserLoginEventProgressInfoResponse(eventId, 2, 3);
      mockService.getProgressInfo.mockResolvedValue(dto);

      const response = await controller.getProgress(eventId, email);

      expect(service.getProgressInfo).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.data.currentLoginCount).toBe(2);
      expect(response.data.requiredLoginCount).toBe(3);
    });
  });

  describe('completeEvent', () => {
    it('이벤트 완료 처리를 수행하고 성공 응답을 반환해야 한다', async () => {
      const eventId = 'event123';
      const email = 'user@example.com';

      const response = await controller.completeEvent(eventId, email);

      expect(service.markAsComplete).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      expect(response.message).toBe('이벤트가 완료 처리되었습니다.');
    });
  });
});
