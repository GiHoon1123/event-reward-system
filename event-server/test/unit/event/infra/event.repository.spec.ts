import { NotFoundException } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { InactiveEventException } from 'src/common/exception/custom/inactive-event.exception';
import { Event } from 'src/event/domain/event';
import { Reward } from 'src/event/domain/reward';
import { EventEntity, EventEntitySchema } from 'src/event/infra/event.entity';
import { EventRepository } from 'src/event/infra/event.repository';

describe('EventRepository', () => {
  let repo: EventRepository;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;
  let eventModel: Model<EventEntity>;

  const creator = 'creator@example.com';

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = (await connect(uri)).connection;
    eventModel = connection.model(EventEntity.name, EventEntitySchema);
    repo = new EventRepository(eventModel);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await eventModel.deleteMany({});
  });

  const createEvent = async (type: string = 'LOGIN_COUNT') => {
    const event = Event.of('이벤트', '설명', type, 3, creator);
    return await repo.save(event);
  };

  it('이벤트를 저장하고 다시 조회할 수 있어야 한다', async () => {
    const saved = await createEvent();
    const found = await repo.findById(saved.id);

    expect(found).not.toBeNull();
    expect(found?.title).toBe('이벤트');
  });

  it('존재하지 않는 ID로 조회 시 null 반환', async () => {
    const result = await repo.findById('64e1fdeeeb0b6a2765a9d999');
    expect(result).toBeNull();
  });

  it('findByIdOrThrow는 존재하지 않을 경우 예외를 발생시켜야 한다', async () => {
    await expect(
      repo.findByIdOrThrow('64e1fdeeeb0b6a2765a9d999'),
    ).rejects.toThrow(NotFoundException);
  });

  it('findActiveById는 비활성화 상태일 경우 예외를 던진다', async () => {
    const saved = await createEvent();
    await repo.updateStatus(saved.id, 'INACTIVE');

    await expect(repo.findActiveById(saved.id)).rejects.toThrow(
      InactiveEventException,
    );
  });

  it('보상을 업데이트하면 새로운 보상으로 교체되어야 한다', async () => {
    const saved = await createEvent();

    await repo.updateRewards(saved.id, [
      Reward.create('포션', 100),
      Reward.create('코인', 200),
    ]);

    const updated = await repo.findByIdOrThrow(saved.id);
    expect(updated.rewards).toHaveLength(2);
    expect(updated.rewards[0].name).toBe('포션');
  });

  it('상태를 ACTIVE에서 INACTIVE로 변경할 수 있어야 한다', async () => {
    const saved = await createEvent();
    await repo.updateStatus(saved.id, 'INACTIVE');

    const updated = await repo.findByIdOrThrow(saved.id);
    expect(updated.status).toBe('INACTIVE');
  });

  it('전체 이벤트 개수를 셀 수 있어야 한다', async () => {
    await createEvent();
    const count = await repo.count();
    expect(count).toBeGreaterThan(0);
  });

  it('페이징된 이벤트를 가져올 수 있어야 한다', async () => {
    await createEvent();
    const list = await repo.findByPage(1, 10);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('findAll은 전체 이벤트를 반환해야 한다', async () => {
    await createEvent();
    const allEvents = await repo.findAll();
    expect(Array.isArray(allEvents)).toBe(true);
    expect(allEvents.length).toBeGreaterThan(0);
    expect(allEvents[0]).toHaveProperty('title');
  });

  it('findActiveByType은 활성 상태의 조건 타입 이벤트를 찾아야 한다', async () => {
    const saved = await createEvent(); // type === 'LOGIN_COUNT'
    const result = await repo.findActiveByType('LOGIN_COUNT');

    expect(result).not.toBeNull();
    expect(result?.id).toBe(saved.id);
    expect(result?.status).toBe('ACTIVE');
  });

  it('findActiveByType은 조건에 맞는 이벤트가 없으면 null을 반환한다', async () => {
    const result = await repo.findActiveByType('FRIEND_INVITE');
    expect(result).toBeNull();
  });

  it('findLoginCountEvent는 조건 타입이 LOGIN_COUNT인 이벤트를 찾아야 한다', async () => {
    const saved = await createEvent('LOGIN_COUNT');
    const result = await repo.findLoginCountEvent();

    expect(result).not.toBeNull();
    expect(result?.id).toBe(saved.id);
    expect(result?.condition.type).toBe('LOGIN_COUNT');
  });

  it('findLoginCountEvent는 해당 조건 타입이 없을 경우 null을 반환해야 한다', async () => {
    await createEvent('FRIEND_INVITE');
    const result = await repo.findLoginCountEvent();

    expect(result).toBeNull();
  });
});
