process.env.JWT_SECRET = 'test-secret';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KafkaProducer } from 'src/user/infra/kafka/kafka.producer';
import * as request from 'supertest';
import { TestAppModule, stopMemoryMongo } from 'test/utils/test-app.module';

jest.setTimeout(20000);

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideProvider(KafkaProducer)
      .useValue({
        emit: jest.fn(),
        send: jest.fn(),
        connect: jest.fn(),
        close: jest.fn(),
        sendLoginEvent: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    await stopMemoryMongo();
  });

  it('/auth/register/user → /auth/login 흐름 성공', async () => {
    const email = 'user@example.com';
    const password = 'validPass123!';

    const regRes = await request(app.getHttpServer())
      .post('/auth/register/user')
      .send({ email, password });

    expect(regRes.status).toBe(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(201);
    expect(loginRes.body.data).toHaveProperty('accessToken');
    expect(loginRes.body.data).toHaveProperty('refreshToken');
  });
});
