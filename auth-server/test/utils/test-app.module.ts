import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from 'src/app.module';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return {
          uri,
        };
      },
    }),
    AppModule,
  ],
})
export class TestAppModule {}

export async function stopMemoryMongo() {
  if (mongod) await mongod.stop();
}
