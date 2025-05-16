// src/common/kafka/kafka.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service',
              brokers: [
                configService.get<string>('KAFKA_BROKER') ?? 'localhost:9092',
              ],
            },
            consumer: {
              groupId: 'auth-consumer',
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule], // 이게 핵심! KAFKA_SERVICE를 포함함
})
export class KafkaModule {}
