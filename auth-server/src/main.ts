import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/global/http-exception.filter';

async function bootstrap() {
  console.log('[ENV] TEST_VAR:', process.env.TEST_VAR);

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 글로벌 유효성 파이프 적용 (class-validator)
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 들어오면 에러
      transform: true, // query param 등도 타입 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
