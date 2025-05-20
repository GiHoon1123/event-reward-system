// test/unit/user/infra/kafka.producer.spec.ts

import { ClientKafka } from '@nestjs/microservices';
import { KafkaProducer } from '../../../../../src/user/infra/kafka/kafka.producer';

describe('KafkaProducer', () => {
  let producer: KafkaProducer;
  const mockKafkaClient = {
    emit: jest.fn(),
    connect: jest.fn(),
    close: jest.fn(), // ✅ 추가
  };

  beforeEach(() => {
    producer = new KafkaProducer(mockKafkaClient as unknown as ClientKafka);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendLoginEvent', () => {
    it('login_event 토픽으로 emit이 호출돼야 한다', async () => {
      const email = 'user@example.com';

      await producer.sendLoginEvent(email);

      expect(mockKafkaClient.emit).toHaveBeenCalledWith(
        'login_event',
        expect.objectContaining({
          value: expect.stringContaining('"email":"user@example.com"'),
        }),
      );
    });
  });

  describe('onModuleInit', () => {
    it('kafkaClient.connect가 호출돼야 한다', async () => {
      await producer.onModuleInit();
      expect(mockKafkaClient.connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('kafkaClient.close가 호출돼야 한다', async () => {
      await producer.onModuleDestroy();
      expect(mockKafkaClient.close).toHaveBeenCalled(); // ✅ 여기
    });
  });
});
