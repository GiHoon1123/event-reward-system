import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './web/auth.controller';
import { RoleController } from './web/role.controller';
import { TokenController } from './web/token.controller';

import { UserService } from './application/user.service';
import { KafkaProducer } from './infra/kafka/kafka.producer';
import { UserEntity, UserSchema } from './infra/user.entity';
import { UserRepository } from './infra/user.repository';

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
  providers: [UserService, UserRepository, KafkaProducer],
  exports: [UserService],
})
export class UserModule {}
