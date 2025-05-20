import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { EventEntity, EventEntitySchema } from 'src/event/infra/event.entity';

describe('EventEntity 스키마 통합 테스트', () => {
  let eventModel: Model<EventEntity>;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = (await connect(uri)).connection;
    eventModel = connection.model('Event', EventEntitySchema);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoServer.stop();
  });

  it('기본값으로 status는 ACTIVE여야 한다', async () => {
    const created = await eventModel.create({
      title: '테스트 이벤트',
      description: '설명',
      condition: { type: 'LOGIN_COUNT', value: 3 },
      rewards: [],
      createdBy: 'creator@example.com',
    });

    expect(created.status).toBe('ACTIVE');
  });

  it('보상 목록은 RewardEntity 배열로 저장되어야 한다', async () => {
    const created = await eventModel.create({
      title: '보상 이벤트',
      condition: { type: 'LOGIN_COUNT', value: 3 },
      rewards: [
        { type: 'ITEM', name: '포션', amount: 100 },
        { type: 'ITEM', name: '골드', amount: 500 },
      ],
      createdBy: 'creator@example.com',
    });

    expect(created.rewards).toHaveLength(2);
    expect(created.rewards[0].name).toBe('포션');
    expect(created.rewards[1].amount).toBe(500);
  });

  it('condition 필드는 type과 value를 포함해야 한다', async () => {
    const created = await eventModel.create({
      title: '조건 이벤트',
      condition: { type: 'LOGIN_COUNT', value: 5 },
      rewards: [],
      createdBy: 'creator@example.com',
    });

    expect(created.condition.type).toBe('LOGIN_COUNT');
    expect(created.condition.value).toBe(5);
  });

  it('createdBy는 필수 값이어야 한다', async () => {
    await expect(
      eventModel.create({
        title: '생성자 누락 이벤트',
        condition: { type: 'LOGIN_COUNT', value: 1 },
        rewards: [],
      }),
    ).rejects.toThrow();
  });
});
