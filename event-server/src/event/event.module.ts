// src/event/event.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './application/service/\bevent.service';
import { EventEntity, EventEntitySchema } from './infra/event.entity';
import { EventRepository } from './infra/event.repository';
import { EventController } from './web/event.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
  exports: [EventRepository],
})
export class EventModule {}
