import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendLoginEvent(email: string): Promise<void> {
    const payload = {
      email,
      loginAt: new Date().toISOString(),
    };

    this.kafkaClient.emit('login_event', {
      value: JSON.stringify(payload),
    });
    console.log('[KafkaProducer] login_event 발행됨:', payload);
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    console.log('[KafkaProducer] Kafka 연결 종료됨');
  }
}
