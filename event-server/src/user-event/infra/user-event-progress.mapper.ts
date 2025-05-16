// src/user-event/infrastructure/user-event.mapper.ts

import { UserEventProgress } from '../domain/user-event-progress';
import { UserEventProgressEntity } from './user-event-progress.entity';

export class UserEventMapper {
  static toEntity(domain: UserEventProgress): Partial<UserEventProgressEntity> {
    return {
      email: domain.email,
      loginCount: domain.getLoginCount(),
      status: domain.getStatus(),
    };
  }

  static toDomain(entity: UserEventProgressEntity): UserEventProgress {
    return new UserEventProgress(
      entity.email,
      entity.loginCount,
      entity.status,
    );
  }
}
