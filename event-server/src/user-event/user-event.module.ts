// src/user-event/infrastructure/user-event.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/event/event.module';
import { RewardService } from './application/service/reward.service';
import { UserProgressService } from './application/service/user-progress.service';
import {
  RewardClaimHistoryEntity,
  RewardClaimHistorySchema,
} from './infrastructure/reward-claim-history.entity';
import { RewardClaimHistoryRepository } from './infrastructure/reward-claim-history.repository';
import {
  UserEventEntity,
  UserEventEntitySchema,
} from './infrastructure/user-event.entity';
import { UserEventRepository } from './infrastructure/user-event.repository';
import { RewardController } from './web/reward.controller';
import { UserProgressController } from './web/user-progress.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEventEntity.name, schema: UserEventEntitySchema },
      {
        name: RewardClaimHistoryEntity.name,
        schema: RewardClaimHistorySchema,
      },
    ]),
    EventModule,
  ],
  controllers: [UserProgressController, RewardController],
  providers: [
    UserEventRepository,
    RewardClaimHistoryRepository,
    UserProgressService,
    RewardService,
  ],
  exports: [],
})
export class UserEventModule {}
