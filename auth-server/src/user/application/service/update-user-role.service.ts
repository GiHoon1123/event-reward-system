// src/user/application/service/update-user-role.service.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserRoleCommand } from '../port/in/command/update-user-role.command';
import { UpdateUserRoleUseCase } from '../port/in/update-user-role.usecase';
import { UserPersistencePort } from '../port/out/user-persistence.port';

@Injectable()
export class UpdateUserRoleService implements UpdateUserRoleUseCase {
  constructor(
    @Inject('UserPersistencePort')
    private readonly userPersistencePort: UserPersistencePort,
  ) {}

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    const targetUser = await this.userPersistencePort.findByEmail(
      command.email,
    );
    if (!targetUser) {
      throw new NotFoundException('대상 유저를 찾을 수 없습니다.');
    }

    targetUser.changeRole(command.role);
    await this.userPersistencePort.updateRoleByEmail(
      command.email,
      targetUser.role,
    );
  }
}
