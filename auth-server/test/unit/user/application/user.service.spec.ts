import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { ChangeUserRoleCommand } from 'src/user/application/\bcommand/change-user-role.command';
import { LoginCommand } from 'src/user/application/\bcommand/login.command';
import { RegisterUserCommand } from 'src/user/application/\bcommand/register-user.command';
import { UserService } from 'src/user/application/user.service';
import { Role, User } from 'src/user/domain/user';
import { KafkaProducer } from 'src/user/infra/kafka/kafka.producer';
import { UserRepository } from 'src/user/infra/user.repository';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;

  const mockUserRepository = {
    existsByEmail: jest.fn(),
    save: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateRefreshToken: jest.fn(),
    updateRoleByEmail: jest.fn(),
  };

  const mockKafkaProducer = {
    sendLoginEvent: jest.fn(),
  };

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockImplementation((plain, hashed) => {
      return plain === 'valid-pass' && hashed === 'hashed-password';
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: KafkaProducer, useValue: mockKafkaProducer },
        JwtService,
      ],
    }).compile();

    service = module.get(UserService);
    jwtService = module.get(JwtService);

    jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(
        (payload: { sub: string }, options?: { expiresIn?: string }) =>
          `signed-token-${payload.sub}-${options?.expiresIn}`,
      );
    jest.spyOn(jwtService, 'verify').mockImplementation((token) => {
      if (token === 'valid-refresh-token') {
        return { sub: 'user-id', email: 'user@example.com', role: Role.USER };
      }
      throw new Error('invalid token');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('이미 등록된 이메일이면 예외를 발생시킨다', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);
      const command = new RegisterUserCommand(
        'test@example.com',
        'pw',
        Role.USER,
      );
      await expect(service.register(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('새로운 유저를 정상적으로 등록한다', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(false);
      const command = new RegisterUserCommand(
        'test@example.com',
        'pw',
        Role.OPERATOR,
      );
      await service.register(command);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          role: Role.OPERATOR,
        }),
      );
    });
  });

  describe('login', () => {
    it('없는 유저거나 비밀번호 불일치 시 예외 발생', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const command = new LoginCommand('test@example.com', 'wrong');
      await expect(service.login(command)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('USER 로그인 시 Kafka 이벤트 전송', async () => {
      const user = User.toDomain(
        'user-id',
        'user@example.com',
        'hashed-password',
        Role.USER,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await service.login(
        new LoginCommand('user@example.com', 'valid-pass'),
      );

      expect(result.accessToken).toBe('signed-token-user-id-1h');
      expect(result.refreshToken).toBe('signed-token-user-id-7d');
      expect(mockKafkaProducer.sendLoginEvent).toHaveBeenCalledWith(
        'user@example.com',
      );
    });

    it('ADMIN 로그인 시 Kafka 이벤트 전송', async () => {
      const user = User.toDomain(
        'admin-id',
        'admin@example.com',
        'hashed-password',
        Role.ADMIN,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login(new LoginCommand('admin@example.com', 'valid-pass'));

      expect(mockKafkaProducer.sendLoginEvent).toHaveBeenCalledWith(
        'admin@example.com',
      );
    });

    it('OPERATOR 로그인 시 Kafka 이벤트 전송하지 않음', async () => {
      const user = User.toDomain(
        'op-id',
        'op@example.com',
        'hashed-password',
        Role.OPERATOR,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login(new LoginCommand('op@example.com', 'valid-pass'));

      expect(mockKafkaProducer.sendLoginEvent).not.toHaveBeenCalled();
    });

    it('AUDITOR 로그인 시 Kafka 이벤트 전송하지 않음', async () => {
      const user = User.toDomain(
        'auditor-id',
        'auditor@example.com',
        'hashed-password',
        Role.AUDITOR,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login(
        new LoginCommand('auditor@example.com', 'valid-pass'),
      );

      expect(mockKafkaProducer.sendLoginEvent).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('리프레시 토큰이 유효하지 않으면 예외 발생', async () => {
      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('DB에 저장된 리프레시 토큰과 일치하지 않으면 예외 발생', async () => {
      const user = User.toDomain(
        'user-id',
        'user@example.com',
        'hashed-password',
        Role.USER,
        'stored-token',
      );
      mockUserRepository.findById.mockResolvedValue(user);

      await expect(service.refresh('valid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('정상적인 리프레시 토큰이면 accessToken을 재발급한다', async () => {
      const user = User.toDomain(
        'user-id',
        'user@example.com',
        'hashed-password',
        Role.USER,
        'valid-refresh-token',
      );
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await service.refresh('valid-refresh-token');

      expect(result.accessToken).toBe('signed-token-user-id-1h');
    });
  });

  describe('changeRole', () => {
    it('유저가 존재하지 않으면 예외 발생', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const command = new ChangeUserRoleCommand('user@example.com', Role.ADMIN);

      await expect(service.changeRole(command)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('정상적으로 역할을 변경한다', async () => {
      const user = User.of('user@example.com', 'pw', Role.USER);
      mockUserRepository.findByEmail.mockResolvedValue(user);

      const command = new ChangeUserRoleCommand(
        'user@example.com',
        Role.OPERATOR,
      );
      await service.changeRole(command);

      expect(user.role).toBe(Role.OPERATOR);
      expect(mockUserRepository.updateRoleByEmail).toHaveBeenCalledWith(
        'user@example.com',
        Role.OPERATOR,
      );
    });
  });

  describe('createAdmin', () => {
    it('이미 존재하는 경우 저장하지 않는다', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);
      await service.createAdmin('admin@example.com', 'adminpw');

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('존재하지 않으면 비밀번호 해싱 후 저장한다', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(false);
      await service.createAdmin('admin@example.com', 'adminpw');

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'admin@example.com',
          role: Role.ADMIN,
        }),
      );
    });
  });
});
