import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import {
  UserLoginEventProgressEntity,
  UserLoginEventProgressSchema,
} from 'src/user-event/infra/user-login-event-progress.entity';
describe('UserLoginEventProgressEntity 스키마', () => {
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<UserLoginEventProgressEntity>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoConnection = (await connect(mongoServer.getUri())).connection;
    model = mongoConnection.model(
      UserLoginEventProgressEntity.name,
      UserLoginEventProgressSchema,
    );
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  it('기본 진행 상태로 문서가 저장되어야 한다', async () => {
    const doc = await model.create({
      email: 'user1@example.com',
      loginCount: 1,
      status: 'IN_PROGRESS',
    });

    expect(doc.email).toBe('user1@example.com');
    expect(doc.loginCount).toBe(1);
    expect(doc.status).toBe('IN_PROGRESS');
    expect(doc.createdAt).toBeInstanceOf(Date);
    expect(doc.updatedAt).toBeInstanceOf(Date);
  });

  it('상태가 COMPLETED인 문서를 저장할 수 있다', async () => {
    const doc = await model.create({
      email: 'user2@example.com',
      loginCount: 3,
      status: 'COMPLETED',
    });

    expect(doc.status).toBe('COMPLETED');
    expect(doc.loginCount).toBe(3);
  });

  it('email은 고유해야 하므로 중복 시 예외가 발생해야 한다', async () => {
    await model.create({
      email: 'duplicate@example.com',
      loginCount: 2,
      status: 'IN_PROGRESS',
    });

    await expect(
      model.create({
        email: 'duplicate@example.com',
        loginCount: 1,
        status: 'IN_PROGRESS',
      }),
    ).rejects.toThrow(/duplicate key error/i);
  });
});
