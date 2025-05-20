import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/global/http-exception.filter';

async function bootstrap() {
  console.log('[ENV] TEST_VAR:', process.env.TEST_VAR);
  console.log('[ENV] TEST_VAR:', process.env.KAFKA_BROKER);

  const app = await NestFactory.create(AppModule);

  // Kafka Consumer 연결
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'event-server',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'user-event-group',
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Event API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 들어오면 에러
      transform: true, // query param 등도 타입 변환
    }),
  );
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
