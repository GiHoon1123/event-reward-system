// src/initializer/initializer.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class InitializerService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;
    const hashed = await bcrypt.hash(password, 10);
    await this.userService.createAdmin(email, hashed);
  }
}
