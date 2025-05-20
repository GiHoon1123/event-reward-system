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
              retry: {
                retries: 10, // 최대 재시도 횟수
                initialRetryTime: 300, // 첫 재시도까지 대기 시간 (ms)
                maxRetryTime: 5000, // 최대 재시도 대기 시간 (ms, 선택)
              },
            },
            consumer: {
              groupId: 'auth-consumer',
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
