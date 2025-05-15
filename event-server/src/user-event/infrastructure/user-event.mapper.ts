// src/user-event/infrastructure/user-event.mapper.ts

import { UserEventProgress } from '../domain/user-event-progress';
import { UserEventEntity } from './user-event.entity';

export class UserEventMapper {
  static toEntity(domain: UserEventProgress): Partial<UserEventEntity> {
    return {
      userEmail: domain.userEmail,
      loginCount: domain.getLoginCount(),
    };
  }

  static toDomain(entity: UserEventEntity): UserEventProgress {
    return new UserEventProgress(entity.userEmail, entity.loginCount);
  }
}
