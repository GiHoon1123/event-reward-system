import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
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
        (payload: { sub: string; email: string; role: Role }, options) => {
          return `signed-token-${payload.sub}-${options?.expiresIn}`;
        },
      );
    jest.spyOn(jwtService, 'verify').mockImplementation((token) => {
      if (token === 'valid-refresh-token') {
        return { sub: 'user-id', email: 'user@example.com', role: Role.USER };
      } else {
        throw new Error('invalid token');
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // signup
  describe('signup', () => {
    it('이미 등록된 이메일이면 예외', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);
      await expect(
        service.signup('test@example.com', 'pass123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('정상 가입 시 save 호출됨', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(false);
      await service.signup('test@example.com', 'pass123', Role.OPERATOR);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          role: Role.OPERATOR,
        }),
      );
    });
  });

  // login
  describe('login', () => {
    it('없는 유저 or 비밀번호 틀리면 예외', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('USER 로그인 시 kafka 호출됨', async () => {
      const user = User.toDomain(
        'user-id',
        'test@example.com',
        'hashed-password',
        Role.USER,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await service.login('test@example.com', 'valid-pass');

      expect(result.accessToken).toMatch(/^signed-token-user-id-1h$/);
      expect(result.refreshToken).toMatch(/^signed-token-user-id-7d$/);
      expect(mockKafkaProducer.sendLoginEvent).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('ADMIN 로그인 시 kafka 호출됨', async () => {
      const user = User.toDomain(
        'admin-id',
        'admin@example.com',
        'hashed-password',
        Role.ADMIN,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login('admin@example.com', 'valid-pass');

      expect(mockKafkaProducer.sendLoginEvent).toHaveBeenCalledWith(
        'admin@example.com',
      );
    });

    it('OPERATOR 로그인 시 kafka 호출 ❌', async () => {
      const user = User.toDomain(
        'op-id',
        'op@example.com',
        'hashed-password',
        Role.OPERATOR,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login('op@example.com', 'valid-pass');

      expect(mockKafkaProducer.sendLoginEvent).not.toHaveBeenCalled();
    });

    it('AUDITOR 로그인 시 kafka 호출 ❌', async () => {
      const user = User.toDomain(
        'auditor-id',
        'auditor@example.com',
        'hashed-password',
        Role.AUDITOR,
        null,
      );
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.login('auditor@example.com', 'valid-pass');

      expect(mockKafkaProducer.sendLoginEvent).not.toHaveBeenCalled();
    });
  });

  // refresh
  describe('refresh', () => {
    it('토큰 검증 실패 시 예외', async () => {
      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('refreshToken 불일치 시 예외', async () => {
      const user = User.toDomain(
        'user-id',
        'user@example.com',
        'hashed-password',
        Role.USER,
        'stored-refresh-token',
      );
      mockUserRepository.findById.mockResolvedValue(user);

      await expect(service.refresh('valid-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('정상 refresh 시 accessToken 발급', async () => {
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

  // changeRole
  describe('changeRole', () => {
    it('유저 없으면 예외', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(
        service.changeRole('x@example.com', Role.ADMIN),
      ).rejects.toThrow(NotFoundException);
    });

    it('정상 변경 시 updateRoleByEmail 호출', async () => {
      const user = User.of('test@example.com', 'pw', Role.USER);
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await service.changeRole('test@example.com', Role.OPERATOR);

      expect(user.role).toBe(Role.OPERATOR);
      expect(mockUserRepository.updateRoleByEmail).toHaveBeenCalledWith(
        'test@example.com',
        Role.OPERATOR,
      );
    });
  });

  // createAdmin
  describe('createAdmin', () => {
    it('이미 있으면 저장 안 함', async () => {
      mockUserRepository.existsByEmail.mockResolvedValue(true);
      await service.createAdmin('admin@example.com', 'adminpw');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('없으면 해싱 후 저장', async () => {
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
