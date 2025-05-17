import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/application/user.service';

@Injectable()
export class InitializerService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;

    await this.userService.createAdmin(email, password);
  }
}
