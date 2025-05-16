import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[ENV] TEST_VAR:', process.env.TEST_VAR);
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
