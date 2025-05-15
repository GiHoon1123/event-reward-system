// src/user/application/service/login-user.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from 'src/common/exception/custom/invalid-credentials.exception';
import { LoginUserCommand } from '../port/in/command/login-user.command';
import { LoginUserUseCase } from '../port/in/login-user-usecase';
import { UserPersistencePort } from '../port/out/user-persistence.port';

@Injectable()
export class LoginUserService implements LoginUserUseCase {
  constructor(
    @Inject('UserPersistencePort')
    private readonly userPersistencePort: UserPersistencePort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userPersistencePort.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialsException('이메일 또는  올바르지 않습니다.');
    }

    console.log('command.password', command.password);
    console.log('user.password', user.password);
    const isMatch = await bcrypt.compare(command.password, user.password);
    if (!isMatch) {
      throw new InvalidCredentialsException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = { sub: user.id, role: user.role, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.userPersistencePort.updateRefreshTokenByUserId(
      user.id,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }
}
