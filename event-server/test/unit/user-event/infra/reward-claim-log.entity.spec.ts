import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import {
  RewardClaimLogEntity,
  RewardClaimLogSchema,
} from 'src/user-event/infra/reward-claim-log.entity';

describe('RewardClaimLogEntity Schema', () => {
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<RewardClaimLogEntity>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongoServer.getUri())).connection;
    model = mongoConnection.model(
      RewardClaimLogEntity.name,
      RewardClaimLogSchema,
    );
    await model.syncIndexes();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  it('필수 필드로 문서가 생성되어야 한다', async () => {
    const doc = await model.create({
      email: 'user@example.com',
      eventId: 'event123',
      rewardName: '코어 잼스톤',
      amount: 50,
      status: 'SUCCESS',
      requestId: 'req-123',
    });

    expect(doc.email).toBe('user@example.com');
    expect(doc.rewardName).toBe('코어 잼스톤');
    expect(doc.status).toBe('SUCCESS');
    expect(doc.requestId).toBe('req-123');
    expect(doc.claimedAt).toBeInstanceOf(Date);
  });

  it('중복된 requestId는 unique 제약으로 인해 실패해야 한다', async () => {
    const baseData = {
      email: 'user2@example.com',
      eventId: 'event123',
      rewardName: '사우나 이용권',
      amount: 1,
      status: 'SUCCESS',
      requestId: 'req-duplicate',
    };

    await model.create(baseData);

    await expect(model.create(baseData)).rejects.toThrow();
  });

  it('reason 필드는 FAILURE 상태일 때 포함될 수 있다', async () => {
    const doc = await model.create({
      email: 'user3@example.com',
      eventId: 'event456',
      rewardName: '익스트림 성장의 비약',
      amount: 100,
      status: 'FAILURE',
      reason: '재고 부족',
      requestId: 'req-failure',
    });

    expect(doc.status).toBe('FAILURE');
    expect(doc.reason).toBe('재고 부족');
  });
});
