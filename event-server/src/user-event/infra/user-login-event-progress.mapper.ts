// src/user-event/infrastructure/user-event.mapper.ts

import { UserLoginEventProgress } from '../domain/user-login-event-progress';
import { UserLoginEventProgressEntity } from './user-login-event-progress.entity';

export class UserLoginEventProgressMapper {
  static toEntity(
    domain: UserLoginEventProgress,
  ): Partial<UserLoginEventProgressEntity> {
    return {
      email: domain.email,
      loginCount: domain.getLoginCount(),
      status: domain.getStatus(),
    };
  }

  static toDomain(
    entity: UserLoginEventProgressEntity,
  ): UserLoginEventProgress {
    return new UserLoginEventProgress(
      entity.email,
      entity.loginCount,
      entity.status,
    );
  }
}
