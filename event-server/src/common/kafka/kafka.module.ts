// user-event/infra/kafka/kafka.module.ts

import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
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
            groupId: 'user-progress-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [],
})
export class KafkaModule {}
