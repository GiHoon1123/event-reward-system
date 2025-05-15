// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthTokenController } from './adapter/in/web/auth-token.controller';
import { UserRoleController } from './adapter/in/web/user-role.controller';
import { UserPersistenceAdapter } from './adapter/out/persistence/user-persistence.adapter';
import { UserEntity, UserSchema } from './adapter/out/persistence/user.entity';
import { LoginUserService } from './application/service/login-user.service';
import { RefreshAccessTokenService } from './application/service/refresh-access-token.service';
import { SignupUserService } from './application/service/signup-user.service';
import { UpdateUserRoleService } from './application/service/update-user-role.service';
import { AuthSessionController } from './adapter/in/web/auth-session.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthSessionController, AuthTokenController, UserRoleController],
  providers: [
    SignupUserService,
    LoginUserService,
    RefreshAccessTokenService,
    {
      provide: 'SignupUserUseCase',
      useClass: SignupUserService,
    },
    {
      provide: 'LoginUserUseCase',
      useClass: LoginUserService,
    },
    {
      provide: 'RefreshAccessTokenUseCase',
      useClass: RefreshAccessTokenService,
    },
    {
      provide: 'UpdateUserRoleUseCase',
      useClass: UpdateUserRoleService,
    },
    {
      provide: 'UserPersistencePort',
      useClass: UserPersistenceAdapter,
    },
  ],
  exports: ['SignupUserUseCase'],
})
export class UserModule {}
