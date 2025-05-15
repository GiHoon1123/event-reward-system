// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './controller/auth.controller';
import { RoleController } from './controller/role.controller';
import { TokenController } from './controller/token.controller';

import { UserEntity, UserSchema } from './infra/user.entity';
import { UserRepository } from './infra/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, TokenController, RoleController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
