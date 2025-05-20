import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { UserModule } from 'src/user/user.module';
import { KafkaMockModule } from './kafka-mock.module'; // ✅ 추가

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
    KafkaMockModule,
    UserModule,
  ],
})
export class TestAppModule {}

export const stopMemoryMongo = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};
