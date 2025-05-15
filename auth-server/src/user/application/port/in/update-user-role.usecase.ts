// src/user/application/port/in/update-user-role.usecase.ts

import { UpdateUserRoleCommand } from './command/update-user-role.command';

export interface UpdateUserRoleUseCase {
  execute(command: UpdateUserRoleCommand): Promise<void>;
}
