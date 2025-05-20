import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from './common/kafka/kafka.module';
import { InitializerModule } from './initializer/initializer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : process.env.NODE_ENV === 'test'
            ? '.env.test'
            : '.env.production',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    KafkaModule,
    UserModule,
    InitializerModule,
  ],
  controllers: [],
})
export class AppModule {}
