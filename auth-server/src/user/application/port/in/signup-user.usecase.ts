// src/user/application/port/in/signup-user.usecase.ts

import { User } from '../../../domain/user';
import { SignupUserCommand } from './command/signup-user.command';

export interface SignupUserUseCase {
  execute(command: SignupUserCommand): Promise<User>;
  createAdmin(email: string, hashedPassword: string): Promise<void>;
  userExists(email: string): Promise<boolean>;
}
