import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DenyRolesGuard } from 'src/auth/deny-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { GatewayService } from 'src/gateway/gateway.service';
import * as request from 'supertest';

describe('GatewayController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GatewayService)
      .useValue({
        forward: jest.fn().mockImplementation((req, res) => {
          res.status(200).json({
            message: `[MOCK] ${req.method} ${req.url}`,
            headers: req.headers,
          });
        }),
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            email: 'admin@example.com',
            role: 'ADMIN',
          };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(DenyRolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '1234' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('[MOCK]');
  });

  afterAll(async () => {
    await app.close();
  });
});
