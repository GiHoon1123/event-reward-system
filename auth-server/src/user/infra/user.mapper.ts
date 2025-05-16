import { User } from '../domain/user';
import { UserEntity } from './user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return User.toDomain(
      entity._id.toString(),
      entity.email,
      entity.password,
      entity.role,
      entity.refreshToken ?? null,
    );
  }

  static toEntity(domain: User): Partial<UserEntity> {
    return {
      email: domain.email,
      password: domain.password,
      role: domain.role,
      refreshToken: domain.refreshToken ?? null,
    };
  }
}
