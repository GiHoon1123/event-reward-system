// src/initializer/initializer.service.ts

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignupUserUseCase } from 'src/user/application/port/in/signup-user.usecase';

@Injectable()
export class InitializerService implements OnModuleInit {
  constructor(
    @Inject('SignupUserUseCase')
    private readonly signupUserUseCase: SignupUserUseCase,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const exists = await this.signupUserUseCase.userExists(email);

    if (!exists) {
      const hashed = await bcrypt.hash(password, 10);
      await this.signupUserUseCase.createAdmin(email, hashed);
      console.log(`[INIT] Admin 계정 자동 생성됨: ${email}`);
    }
  }
}
