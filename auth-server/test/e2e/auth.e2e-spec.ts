// test/e2e/auth/auth.e2e-spec.ts

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { stopMemoryMongo, TestAppModule } from 'test/utils/test-app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await stopMemoryMongo();
  });

  it('/auth/register/user → /auth/login 흐름 성공', async () => {
    const email = 'user@example.com';
    const password = 'validPass123!';

    // 1. 회원가입
    const regRes = await request(app.getHttpServer())
      .post('/auth/register/user')
      .send({ email, password });

    expect(regRes.status).toBe(201);

    // 2. 로그인
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(201);
    expect(loginRes.body.data).toHaveProperty('accessToken');
    expect(loginRes.body.data).toHaveProperty('refreshToken');
  });
});
