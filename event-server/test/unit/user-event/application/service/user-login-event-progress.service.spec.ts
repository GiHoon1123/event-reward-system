import { BadRequestException } from '@nestjs/common';
import { Event } from 'src/event/domain/event';
import { EventRepository } from 'src/event/infra/event.repository';
import { CompleteLoginEventCommand } from 'src/user-event/application/command/complete-login-event.command';
import { IncreaseLoginCountCommand } from 'src/user-event/application/command/increase-login-count.command';
import { GetProgressInfoQuery } from 'src/user-event/application/query/get-progress-info-query';
import { UserLoginEventProgressService } from 'src/user-event/application/service/user-login-event-progress.service';
import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';
import { UserLoginEventProgressRepository } from 'src/user-event/infra/user-login-event-progress.repository';

describe('UserLoginEventProgressService', () => {
  let service: UserLoginEventProgressService;
  let eventRepository: jest.Mocked<EventRepository>;
  let progressRepository: jest.Mocked<UserLoginEventProgressRepository>;

  beforeEach(() => {
    eventRepository = {
      findLoginCountEvent: jest.fn(),
      findActiveById: jest.fn(),
    } as any;

    progressRepository = {
      findByUserEmail: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new UserLoginEventProgressService(
      progressRepository,
      eventRepository,
    );
  });

  describe('increaseLoginCount', () => {
    it('이벤트가 존재하지 않으면 아무 작업도 하지 않는다', async () => {
      eventRepository.findLoginCountEvent.mockResolvedValue(null);
      await expect(
        service.increaseLoginCount(
          new IncreaseLoginCountCommand('user@example.com'),
        ),
      ).resolves.toBeUndefined();
    });

    it('기존 진행도가 있으면 증가시키고 저장해야 한다', async () => {
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progressRepository.findByUserEmail.mockResolvedValue(progress);
      eventRepository.findLoginCountEvent.mockResolvedValue({} as Event);

      await service.increaseLoginCount(
        new IncreaseLoginCountCommand('user@example.com'),
      );

      expect(progress.getLoginCount()).toBe(2);
      expect(progressRepository.save).toHaveBeenCalled();
    });
  });

  describe('getProgressInfo', () => {
    it('기존 진행도가 없으면 새로 생성하고 반환해야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(null);

      const query = new GetProgressInfoQuery('event123', 'user@example.com');
      const result = await service.getProgressInfo(query);

      expect(result.eventId).toBe('event123');
      expect(result.currentLoginCount).toBe(1);
      expect(result.requiredLoginCount).toBe(3);
      expect(progressRepository.save).toHaveBeenCalled();
    });
  });

  describe('markAsComplete', () => {
    it('조건 미달이면 예외를 던져야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      const progress = UserLoginEventProgress.createInitial('user@example.com');

      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new CompleteLoginEventCommand(
        'event123',
        'user@example.com',
      );

      await expect(service.markAsComplete(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('이미 완료된 이벤트면 예외를 던져야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        1,
        'admin@example.com',
      );
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progress.increase();
      progress.markComplete();

      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new CompleteLoginEventCommand(
        'event123',
        'user@example.com',
      );

      await expect(service.markAsComplete(command)).rejects.toThrow(
        '이미 참여 완료한 이벤트입니다',
      );
    });

    it('정상적으로 완료되면 저장해야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        1,
        'admin@example.com',
      );
      const progress = UserLoginEventProgress.createInitial('user@example.com');
      progress.increase();

      eventRepository.findActiveById.mockResolvedValue(event);
      progressRepository.findByUserEmail.mockResolvedValue(progress);

      const command = new CompleteLoginEventCommand(
        'event123',
        'user@example.com',
      );

      await service.markAsComplete(command);

      expect(progress.isCompleted()).toBe(true);
      expect(progressRepository.save).toHaveBeenCalled();
    });
  });
});
