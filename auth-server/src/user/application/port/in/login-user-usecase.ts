// src/user/application/port/in/login-user.usecase.ts

import { LoginUserCommand } from './command/login-user.command';

export interface LoginUserUseCase {
  execute(
    command: LoginUserCommand,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
