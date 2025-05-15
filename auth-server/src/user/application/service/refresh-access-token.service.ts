// src/user/application/service/refresh-access-token.service.ts

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshAccessTokenCommand } from '../port/in/command/refresh-access-token.command';
import { RefreshAccessTokenUseCase } from '../port/in/refresh-access-token.usecase';
import { UserPersistencePort } from '../port/out/user-persistence.port';

@Injectable()
export class RefreshAccessTokenService implements RefreshAccessTokenUseCase {
  constructor(
    @Inject('UserPersistencePort')
    private readonly userPersistencePort: UserPersistencePort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: RefreshAccessTokenCommand,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = command;

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
      }
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const user = await this.userPersistencePort.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 일치하지 않습니다.');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id, role: user.role, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );

    return { accessToken: newAccessToken };
  }
}
