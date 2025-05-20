// test/unit/user/infra/user.entity.spec.ts

import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Role } from 'src/user/domain/user';
import { UserSchema } from 'src/user/infra/user.entity';

describe('UserEntity Schema', () => {
  let userModel: Model<any>;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = (await connect(uri)).connection;
    userModel = connection.model('User', UserSchema);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoServer.stop();
  });

  it('기본 role은 USER 이어야 한다', async () => {
    const created = await userModel.create({
      email: 'test@example.com',
      password: '1234',
    });

    expect(created.role).toBe(Role.USER);
    expect(created.refreshToken).toBeNull();
  });

  it('enum에 없는 role이면 저장 실패해야 한다', async () => {
    await expect(
      userModel.create({
        email: 'invalid@example.com',
        password: '1234',
        role: 'INVALID',
      }),
    ).rejects.toThrow();
  });
});
