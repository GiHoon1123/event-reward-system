// src/user-event/infrastructure/user-event.mapper.ts

import { UserEventProgress } from '../domain/user-event-progress';
import { UserEventProgressEntity } from './user-event-progress.entity';

export class UserEventMapper {
  static toEntity(domain: UserEventProgress): Partial<UserEventProgressEntity> {
    return {
      userEmail: domain.userEmail,
      loginCount: domain.getLoginCount(),
    };
  }

  static toDomain(entity: UserEventProgressEntity): UserEventProgress {
    return new UserEventProgress(entity.userEmail, entity.loginCount);
  }
}
