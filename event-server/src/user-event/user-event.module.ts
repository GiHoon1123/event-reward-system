import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/event/event.module';
import { UserLoginEventProgressService } from './application/service/user-login-event-progress.service';
import { UserLoginEventRewardService } from './application/service/user-login-event-reward.service';
import { LoginEventConsumer } from './infra/kafaka/login-event.consumer';
import { InMemoryLockManager } from './infra/lock/in-memory-lock.manager';
import {
  RewardClaimHistoryEntity,
  RewardClaimHistorySchema,
} from './infra/reward-claim-history.entity';
import { RewardClaimHistoryRepository } from './infra/reward-claim-history.repository';
import {
  RewardClaimLogEntity,
  RewardClaimLogSchema,
} from './infra/reward-claim-log.entity';
import { RewardClaimLogRepository } from './infra/reward-claim-log.repository';
import {
  UserLoginEventProgressEntity,
  UserLoginEventProgressSchema,
} from './infra/user-login-event-progress.entity';
import { UserLoginEventProgressRepository } from './infra/user-login-event-progress.repository';
import { UserProgressController } from './web/user-progress.controller';
import { UserRewardHistoryController } from './web/user-reward-history.controller';
import { UserRewardController } from './web/user-reward.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserLoginEventProgressEntity.name,
        schema: UserLoginEventProgressSchema,
      },
      {
        name: RewardClaimHistoryEntity.name,
        schema: RewardClaimHistorySchema,
      },
      {
        name: RewardClaimLogEntity.name,
        schema: RewardClaimLogSchema,
      },
    ]),
    EventModule,
  ],
  controllers: [
    UserProgressController,
    UserRewardController,
    UserRewardHistoryController,
    LoginEventConsumer,
  ],
  providers: [
    InMemoryLockManager,
    UserLoginEventProgressRepository,
    RewardClaimHistoryRepository,
    RewardClaimLogRepository,
    UserLoginEventProgressService,
    UserLoginEventRewardService,
  ],
  exports: [],
})
export class UserEventModule {}
