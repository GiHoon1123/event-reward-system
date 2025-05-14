// src/user/application/service/signup-user.service.ts

import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../../domain/user';
import { SignupUserCommand } from '../port/in/command/signup-user.command';
import { SignupUserUseCase } from '../port/in/signup-user.usecase';
import { UserPersistencePort } from '../port/out/user-persistence.port';

@Injectable()
export class SignupUserService implements SignupUserUseCase {
  constructor(
    @Inject('UserPersistencePort')
    private readonly userPersistencePort: UserPersistencePort,
  ) {}

  async execute(command: SignupUserCommand): Promise<User> {
    const exists = await this.userPersistencePort.existsByEmail(command.email);
    if (exists) throw new Error('이미 가입된 이메일입니다.');
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const user = User.of(
      command.email,
      hashedPassword,
      command.role ?? Role.USER,
    );
    return await this.userPersistencePort.save(user);
  }

  async createAdmin(email: string, hashedPassword: string): Promise<void> {
    const admin = User.of(email, hashedPassword, Role.ADMIN);
    await this.userPersistencePort.save(admin);
  }

  async userExists(email: string): Promise<boolean> {
    return this.userPersistencePort.existsByEmail(email);
  }
}
