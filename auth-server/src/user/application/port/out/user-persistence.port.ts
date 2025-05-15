// src/user/application/port/out/user-persistence.port.ts

import { Role, User } from '../../../domain/user';

export interface UserPersistencePort {
  save(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  updateRoleByEmail(email: string, role: Role);
  findById(userId: string): Promise<User | null>; // ✅ 추가
  updateRefreshTokenByUserId(
    userId: string,
    refreshToken: string,
  ): Promise<void>;
}
