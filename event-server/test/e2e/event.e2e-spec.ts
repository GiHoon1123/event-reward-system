import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { EventEntity } from 'src/event/infra/event.entity';
import * as request from 'supertest';
import { TestAppModule, stopMemoryMongo } from 'test/utils/test-app.module';

jest.setTimeout(20000); // 충분한 타임아웃 설정

describe('PublicEventController (e2e)', () => {
  let app: INestApplication;
  let eventModel: Model<EventEntity>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // 🟡 Nest DI로 주입된 모델을 가져와야 함 (직접 mongoose.connect 금지!)
    eventModel = moduleFixture.get<Model<EventEntity>>(
      getModelToken(EventEntity.name),
    );
  });

  afterAll(async () => {
    await eventModel.deleteMany(); // DB 초기화
    await app.close();
    await stopMemoryMongo(); // MongoMemoryServer 종료
  });

  it('/events (GET) - 이벤트 목록 조회 성공', async () => {
    await eventModel.create({
      title: 'e2e 목록 테스트',
      description: '테스트 설명',
      condition: { type: 'LOGIN_COUNT', value: 3 },
      status: 'ACTIVE',
      rewards: [],
      createdBy: 'admin@example.com',
    });

    const res = await request(app.getHttpServer()).get(
      '/events?page=1&limit=10',
    );

    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe('e2e 목록 테스트');
  });
});
