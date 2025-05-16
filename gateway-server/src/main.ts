import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[ENV] TEST_VAR:', process.env.TEST_VAR);
  console.log('process.env.AUTH_SERVER', process.env.AUTH_SERVER);
  console.log('process.env.EVENT_SERVER', process.env.EVENT_SERVER);

  const app = await NestFactory.create(AppModule, { bodyParser: false });
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
