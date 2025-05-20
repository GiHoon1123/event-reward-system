import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';

import { EventEntity } from 'src/event/infra/event.entity';
import { TestAppModule, stopMemoryMongo } from 'test/utils/test-app.module';

describe('UserEvent E2E', () => {
  let app: INestApplication;
  let eventModel: Model<EventEntity>;

  const email = 'user@example.com';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    eventModel = moduleFixture.get<Model<EventEntity>>(
      getModelToken(EventEntity.name),
    );
  });

  afterAll(async () => {
    await eventModel.deleteMany();
    await app.close();
    await stopMemoryMongo();
  });

  describe('/events/users/progress/:eventId (GET)', () => {
    it('유저의 진행도 정보를 조회한다', async () => {
      // ✅ 테스트용 이벤트 생성
      const created = await eventModel.create({
        title: '진행도 테스트',
        description: '로그인 조건 테스트',
        condition: { type: 'LOGIN_COUNT', value: 3 },
        status: 'ACTIVE',
        rewards: [],
        createdBy: 'admin@example.com',
      });

      const eventId = created._id.toString();

      const res = await request(app.getHttpServer())
        .get(`/events/users/progress/${eventId}`)
        .set('x-user-email', email)
        .expect(200);

      expect(res.body.data).toHaveProperty('eventId');
      expect(res.body.data).toHaveProperty('currentLoginCount');
      expect(res.body.data).toHaveProperty('requiredLoginCount');
    });
  });
});
