import { BadRequestException, ConflictException } from '@nestjs/common';
import { AddRewardsCommand } from 'src/event/application/command/add-rewards.command';
import { CreateEventCommand } from 'src/event/application/command/create-event.command';
import { EventStatusChangeCommand } from 'src/event/application/command/event-status-chagne-command';
import { GetEventDetailQuery } from 'src/event/application/query/get-event-detail.query';
import { GetEventListQuery } from 'src/event/application/query/get-event-list.query';
import { GetEventRewardsQuery } from 'src/event/application/query/get-event-rewards.query';
import { EventService } from 'src/event/application/service/event.service';
import { Event } from 'src/event/domain/event';
import { Reward } from 'src/event/domain/reward';
import { EventRepository } from 'src/event/infra/event.repository';

describe('EventService', () => {
  let service: EventService;
  let repository: jest.Mocked<EventRepository>;

  beforeEach(() => {
    repository = {
      findActiveByType: jest.fn(),
      save: jest.fn(),
      findActiveById: jest.fn(),
      updateRewards: jest.fn(),
      findByPage: jest.fn(),
      count: jest.fn(),
      findByIdOrThrow: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    service = new EventService(repository);
  });

  describe('createEvent', () => {
    it('이미 등록된 이벤트 타입이면 ConflictException 발생', async () => {
      repository.findActiveByType.mockResolvedValue({} as Event);

      const command = new CreateEventCommand(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      await expect(service.createEvent(command)).rejects.toThrow(
        ConflictException,
      );
    });

    it('정상적으로 생성되면 저장된 id 반환', async () => {
      repository.findActiveByType.mockResolvedValue(null);
      const saved = new Event(
        'id123',
        '제목',
        '설명',
        { type: 'LOGIN_COUNT', value: 3 },
        'ACTIVE',
        [],
        'admin@example.com',
        new Date(),
      );
      repository.save.mockResolvedValue(saved);

      const command = new CreateEventCommand(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      const result = await service.createEvent(command);
      expect(result).toBe('id123');
    });
  });

  describe('addRewards', () => {
    it('작성자가 아닌 경우 BadRequestException 발생', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'creator@example.com',
      );
      repository.findActiveById.mockResolvedValue(event);

      const command = new AddRewardsCommand(
        'event1',
        [{ name: '포션', amount: 1 }],
        'not-owner@example.com',
      );
      await expect(service.addRewards(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('중복된 보상 이름이 있으면 BadRequestException 발생', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'owner@example.com',
      );
      event.addRewards([Reward.create('포션', 1)], 'owner@example.com');
      repository.findActiveById.mockResolvedValue(event);

      const command = new AddRewardsCommand(
        'event1',
        [{ name: '포션', amount: 2 }],
        'owner@example.com',
      );
      await expect(service.addRewards(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('정상 등록 시 updateRewards 호출', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'owner@example.com',
      );
      repository.findActiveById.mockResolvedValue(event);

      const command = new AddRewardsCommand(
        'event1',
        [{ name: '엘릭서', amount: 2 }],
        'owner@example.com',
      );
      await service.addRewards(command);
      expect(repository.updateRewards).toHaveBeenCalled();
    });
  });

  describe('getAllEventsWithPage', () => {
    it('이벤트 목록과 메타 정보를 반환해야 한다', async () => {
      repository.findByPage.mockResolvedValue([{} as Event]);
      repository.count.mockResolvedValue(10);

      const query = new GetEventListQuery(1, 10);
      const result = await service.getAllEventsWithPage(query);

      expect(result.items).toHaveLength(1);
      expect(result.meta.totalCount).toBe(10);
    });
  });

  describe('getRewardsByEventId', () => {
    it('보상 목록 DTO를 반환해야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      event.addRewards([Reward.create('포션', 100)], 'admin@example.com');
      repository.findByIdOrThrow.mockResolvedValue(event);

      const query = new GetEventRewardsQuery('event123');
      const result = await service.getRewardsByEventId(query);

      expect(result.rewards[0].name).toBe('포션');
    });
  });

  describe('getEventDetail', () => {
    it('이벤트 상세 정보를 반환해야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      repository.findByIdOrThrow.mockResolvedValue(event);

      const query = new GetEventDetailQuery('event123');
      const result = await service.getEventDetail(query);

      expect(result.title).toBe('제목');
    });
  });

  describe('changeStatus', () => {
    it('작성자가 아닌 경우 BadRequestException 발생', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      repository.findByIdOrThrow.mockResolvedValue(event);

      const command = new EventStatusChangeCommand(
        'event1',
        'ACTIVE',
        'not-admin@example.com',
      );
      await expect(service.changeStatus(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('작성자면 상태를 변경하고 저장해야 한다', async () => {
      const event = Event.of(
        '제목',
        '설명',
        'LOGIN_COUNT',
        3,
        'admin@example.com',
      );
      repository.findByIdOrThrow.mockResolvedValue(event);

      const command = new EventStatusChangeCommand(
        'event1',
        'INACTIVE',
        'admin@example.com',
      );
      await service.changeStatus(command);
      expect(repository.updateStatus).toHaveBeenCalledWith(
        'event1',
        'INACTIVE',
      );
    });
  });
});
