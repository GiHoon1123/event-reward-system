import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { InitializerService } from './initializer.service';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [InitializerService],
})
export class InitializerModule {}
