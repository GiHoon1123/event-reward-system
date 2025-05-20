import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './application/service/event.service';
import { EventEntity, EventEntitySchema } from './infra/event.entity';
import { EventRepository } from './infra/event.repository';
import { AdminEventController } from './web/admin.event.controller';
import { PublicEventController } from './web/public.event.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventEntitySchema },
    ]),
  ],
  controllers: [AdminEventController, PublicEventController],
  providers: [EventService, EventRepository],
  exports: [EventRepository],
})
export class EventModule {}
