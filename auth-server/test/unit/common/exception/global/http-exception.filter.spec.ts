import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  INestApplication,
  Module,
  UseFilters,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from 'src/common/exception/global/http-exception.filter';
import * as request from 'supertest';

// 테스트용 컨트롤러
@Controller('test')
@UseFilters(HttpExceptionFilter) // 이 필터 적용
class TestExceptionController {
  @Get('error')
  throwError() {
    throw new HttpException('에러 발생!', HttpStatus.BAD_REQUEST);
  }
}

// 테스트용 모듈
@Module({
  controllers: [TestExceptionController],
})
class TestModule {}

describe('HttpExceptionFilter', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('예외가 발생하면 커스텀 응답 형식으로 반환되어야 한다', () => {
    return request(app.getHttpServer()).get('/test/error').expect(400).expect({
      statusCode: 400,
      message: '에러 발생!',
    });
  });
});
