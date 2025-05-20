import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import {
  RewardClaimHistoryEntity,
  RewardClaimHistorySchema,
} from 'src/user-event/infra/reward-claim-history.entity';
import { RewardClaimHistoryRepository } from 'src/user-event/infra/reward-claim-history.repository';

describe('RewardClaimHistoryRepository', () => {
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<RewardClaimHistoryEntity>;
  let repository: RewardClaimHistoryRepository;

  const baseEventId = 'event123';
  const baseEmail = 'user@example.com';

  const sampleReward = RewardClaimHistory.success('코어 젬스톤', 10, 'req-001');

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongoServer.getUri())).connection;
    model = mongoConnection.model(
      RewardClaimHistoryEntity.name,
      RewardClaimHistorySchema,
    );
    repository = new RewardClaimHistoryRepository(model);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  it('보상 히스토리를 rewards 배열에 추가할 수 있다', async () => {
    await repository.appendReward(baseEventId, baseEmail, sampleReward);

    const doc = await model.findOne({ eventId: baseEventId, email: baseEmail });
    expect(doc).toBeDefined();
    expect(doc!.rewards.length).toBe(1);
    expect(doc!.rewards[0].rewardName).toBe('코어 젬스톤');
  });

  it('같은 requestId가 존재하는지 확인할 수 있다', async () => {
    const exists = await repository.hasRequestId(
      baseEventId,
      baseEmail,
      'req-001',
    );
    expect(exists).toBe(true);

    const notExists = await repository.hasRequestId(
      baseEventId,
      baseEmail,
      'req-999',
    );
    expect(notExists).toBe(false);
  });

  it('성공한 특정 보상의 수량을 합산할 수 있다', async () => {
    const moreReward = RewardClaimHistory.success('코어 젬스톤', 20, 'req-002');
    await repository.appendReward(baseEventId, baseEmail, moreReward);

    const total = await repository.getClaimedAmount(
      baseEventId,
      baseEmail,
      '코어 젬스톤',
    );
    expect(total).toBe(30);
  });

  it('전체 보상 히스토리를 조회할 수 있다', async () => {
    const result = await repository.findByEventAndEmail(baseEventId, baseEmail);
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(RewardClaimHistory);
  });

  it('성공한 보상 히스토리만 필터링해서 조회할 수 있다', async () => {
    // 실패 히스토리 추가
    const failed = RewardClaimHistory.failure(
      '코어 젬스톤',
      10,
      '재고 부족',
      'req-003',
    );
    await repository.appendReward(baseEventId, baseEmail, failed);

    const result = await repository.findSuccessHistories(
      baseEventId,
      baseEmail,
    );
    expect(result.length).toBe(2);
    expect(result.every((r) => r.status === 'SUCCESS')).toBe(true);
  });
});
