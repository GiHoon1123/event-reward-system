// src/user/application/port/in/refresh-access-token.usecase.ts

import { RefreshAccessTokenCommand } from './command/refresh-access-token.command';

export interface RefreshAccessTokenUseCase {
  execute(command: RefreshAccessTokenCommand): Promise<{ accessToken: string }>;
}
