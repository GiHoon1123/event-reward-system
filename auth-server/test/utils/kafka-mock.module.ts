import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'KAFKA_SERVICE',
      useValue: {
        send: jest.fn(),
        emit: jest.fn(),
        connect: jest.fn(),
        close: jest.fn(),
      },
    },
  ],
  exports: ['KAFKA_SERVICE'],
})
export class KafkaMockModule {}
