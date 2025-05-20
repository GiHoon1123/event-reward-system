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

  it('정상적으로 문서를 생성할 수 있다', async () => {
    const doc = await model.create({
      email: 'user@example.com',
    });

    expect(doc.email).toBe('user@example.com');
    expect(doc.loginCount).toBe(0); // default
    expect(doc.status).toBe('IN_PROGRESS'); // default
  });

  it('status가 enum 외 값이면 예외가 발생해야 한다', async () => {
    await expect(
      model.create({
        email: 'invalid@example.com',
        status: 'INVALID',
      }),
    ).rejects.toThrow();
  });

  it('email은 고유해야 하므로 중복 시 예외가 발생해야 한다', async () => {
    await model.create({ email: 'duplicate@example.com' });

    await expect(
      model.create({ email: 'duplicate@example.com' }),
    ).rejects.toThrow();
  });
});
