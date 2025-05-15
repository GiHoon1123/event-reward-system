// src/user-event/infrastructure/user-event.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/event/event.module';
import { UserProgressService } from './application/service/user-progress.service';
import { UserRewardService } from './application/service/user-reward.service';
import {
  RewardClaimHistoryEntity,
  RewardClaimHistorySchema,
} from './infrastructure/reward-claim-history.entity';
import { RewardClaimHistoryRepository } from './infrastructure/reward-claim-history.repository';
import {
  UserEventProgressEntity,
  UserEventProgressEntitySchema,
} from './infrastructure/user-event-progress.entity';
import { UserEventRepository } from './infrastructure/user-event-progress.repository';
import { UserProgressController } from './web/user-progress.controller';
import { UserRewardHistoryController } from './web/user-reward-history.controller';
import { UserRewardController } from './web/user-reward.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEventProgressEntity.name,
        schema: UserEventProgressEntitySchema,
      },
      {
        name: RewardClaimHistoryEntity.name,
        schema: RewardClaimHistorySchema,
      },
    ]),
    EventModule,
  ],
  controllers: [
    UserProgressController,
    UserRewardController,
    UserRewardHistoryController,
  ],
  providers: [
    UserEventRepository,
    RewardClaimHistoryRepository,
    UserProgressService,
    UserRewardService,
  ],
  exports: [],
})
export class UserEventModule {}
