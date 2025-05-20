import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../domain/user';
import { KafkaProducer } from '../infra/kafka/kafka.producer';
import { UserRepository } from '../infra/user.repository';
import { ChangeUserRoleCommand } from './\bcommand/change-user-role.command';
import { RegisterUserCommand } from './\bcommand/register-user.command';
import { AccessTokenResponseDto } from './\bdto/access-token-response';
import { LoginResponseDto } from './\bdto/login-response';
import { LoginCommand } from './\bcommand/login.command';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  async register(command: RegisterUserCommand): Promise<void> {
    const { email, password, role } = command;
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new BadRequestException('이미 등록된 이메일입니다.');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = User.of(email, hashed, role);
    await this.userRepository.save(user);
  }

  async login(command: LoginCommand): Promise<LoginResponseDto> {
    const { email, password } = command;
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.userRepository.updateRefreshToken(user.id!, refreshToken);

    if (user.role == Role.ADMIN || user.role == Role.USER) {
      await this.kafkaProducer.sendLoginEvent(email);
    }

    const dto = new LoginResponseDto(accessToken, refreshToken);
    return dto;
  }

  async refresh(refreshToken: string): Promise<AccessTokenResponseDto> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 일치하지 않습니다.');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );
    const dto = new AccessTokenResponseDto(newAccessToken);
    return dto;
  }

  async changeRole(command: ChangeUserRoleCommand): Promise<void> {
    const { email, newRole } = command;
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    user.changeRole(newRole);
    await this.userRepository.updateRoleByEmail(email, newRole);
  }

  async createAdmin(email: string, password: string): Promise<void> {
    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      console.log(`[UserService] Admin user already exists: ${email}`);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const adminUser = User.of(email, hashed, Role.ADMIN);
    await this.userRepository.save(adminUser);

    console.log(`[UserService] Admin user created: ${email}`);
  }
}
