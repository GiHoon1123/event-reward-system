import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { EventModule } from 'src/event/event.module';
import { UserEventModule } from 'src/user-event/user-event.module';

let mongoServer: MongoMemoryServer;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        return { uri };
      },
    }),
    EventModule,
    UserEventModule,
  ],
})
export class TestAppModule {}

export const stopMemoryMongo = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};
