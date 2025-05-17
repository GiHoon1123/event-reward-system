import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/event/event.module';
import { UserLoginEventProgressService } from './application/service/user-login-event-progress.service';
import { UserLoginEventRewardService } from './application/service/user-login-event-reward.service';
import { LoginEventConsumer } from './infra/kafaka/login-event.consumer';
import {
  RewardClaimHistoryEntity,
  RewardClaimHistorySchema,
} from './infra/reward-claim-history.entity';
import { RewardClaimHistoryRepository } from './infra/reward-claim-history.repository';
import {
  UserLoginEventProgressEntity,
  UserLoginEventProgressEntitySchema,
} from './infra/user-login-event-progress.entity';
import { UserLoginEventProgressRepository } from './infra/user-login-event-progress.repository';
import { UserProgressController } from './web/user-login-event-progress.controller';
import { UserRewardHistoryController } from './web/user-reward-history.controller';
import { UserRewardController } from './web/user-reward.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserLoginEventProgressEntity.name,
        schema: UserLoginEventProgressEntitySchema,
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
    LoginEventConsumer,
  ],
  providers: [
    UserLoginEventProgressRepository,
    RewardClaimHistoryRepository,
    UserLoginEventProgressService,
    UserLoginEventRewardService,
  ],
  exports: [],
})
export class UserEventModule {}
