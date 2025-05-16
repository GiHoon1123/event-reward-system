// user-event/infra/kafka/kafka.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'event-consumer',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'user-progress-consumer-group', // ✅ 유일한 그룹 ID 필수
          },
        },
      },
    ]),
  ],
  controllers: [], // ✅ 이 컨트롤러가 consumer 역할
})
export class KafkaModule {}
