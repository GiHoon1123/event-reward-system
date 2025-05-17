// test/unit/user/web/auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/application/user.service';
import { Role } from 'src/user/domain/user';
import { AuthController } from 'src/user/web/auth.controller';
import { CreateUserRequestDto } from 'src/user/web/dto/create-user.request';
import { LoginUserRequestDto } from 'src/user/web/dto/login-user.request';

describe('AuthController', () => {
  let controller: AuthController;
  const mockUserService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createDto = {
    email: 'user@example.com',
    password: 'securePassword123!',
  } satisfies CreateUserRequestDto;

  describe('회원 등록 API', () => {
    it.each([
      ['registerUser', Role.USER, 'USER 등록 성공'],
      ['registerOperator', Role.OPERATOR, 'OPERATOR 등록 성공'],
      ['registerAuditor', Role.AUDITOR, 'AUDITOR 등록 성공'],
      ['registerAdmin', Role.ADMIN, 'ADMIN 등록 성공'],
    ])(
      '%s 호출 시 UserService.signup이 호출돼야 함',
      async (method, role, message) => {
        const res = await controller[method](createDto);
        expect(mockUserService.signup).toHaveBeenCalledWith(
          createDto.email,
          createDto.password,
          role,
        );
        expect(res).toMatchObject({
          statusCode: 201,
          message,
        });
      },
    );
  });

  describe('login()', () => {
    it('UserService.login 호출 후 토큰이 응답에 포함돼야 한다', async () => {
      const dto: LoginUserRequestDto = {
        email: 'user@example.com',
        password: 'securePassword123!',
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUserService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(dto);

      expect(mockUserService.login).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(result).toEqual({
        statusCode: 201,
        message: '로그인 성공',
        data: mockTokens,
      });
    });
  });
});
