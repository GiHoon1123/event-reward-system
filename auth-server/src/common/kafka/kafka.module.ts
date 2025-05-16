// src/common/kafka/kafka.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

const KafkaClientProvider = ClientsModule.register([
  {
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service',
        brokers: [process.env.KAFKA_BROKER || '127.0.0.1:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  },
]);

@Module({
  imports: [KafkaClientProvider],
  exports: [KafkaClientProvider],
})
export class KafkaModule {}
