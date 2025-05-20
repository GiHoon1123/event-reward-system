import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from './common/kafka/kafka.module';
import { EventModule } from './event/event.module';
import { UserEventModule } from './user-event/user-event.module';

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
    EventModule,
    KafkaModule,
    UserEventModule,
  ],
  controllers: [],
})
export class AppModule {}
