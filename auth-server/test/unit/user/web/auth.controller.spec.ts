import { Test, TestingModule } from '@nestjs/testing';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { LoginResponseDto } from 'src/user/application/\bdto/login-response';
import { UserService } from 'src/user/application/user.service';
import { Role } from 'src/user/domain/user';
import { AuthController } from 'src/user/web/auth.controller';
import { LoginUserRequestDto } from 'src/user/web/dto/login-user.request';
import { RegisterUserRequestDto } from 'src/user/web/dto/register-user.request';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get(UserService);
  });

  describe('registerUser', () => {
    it('일반 유저(USER) 등록 테스트', async () => {
      const dto: RegisterUserRequestDto = {
        email: 'user@example.com',
        password: 'securePassword123!',
      };

      const result = await controller.registerUser(dto);

      expect(userService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: dto.password,
          role: Role.USER,
        }),
      );
      expect(result).toEqual(new CommonResponse(201, 'USER 등록 성공'));
    });
  });

  describe('registerOperator', () => {
    it('운영자(OPERATOR) 등록 테스트', async () => {
      const dto = { email: 'operator@example.com', password: 'pw' };
      const result = await controller.registerOperator(dto as any);

      expect(userService.register).toHaveBeenCalled();
      expect(result).toEqual(new CommonResponse(201, 'OPERATOR 등록 성공'));
    });
  });

  describe('registerAuditor', () => {
    it('감사자(AUDITOR) 등록 테스트', async () => {
      const dto = { email: 'auditor@example.com', password: 'pw' };
      const result = await controller.registerAuditor(dto as any);

      expect(userService.register).toHaveBeenCalled();
      expect(result).toEqual(new CommonResponse(201, 'AUDITOR 등록 성공'));
    });
  });

  describe('registerAdmin', () => {
    it('관리자(ADMIN) 등록 테스트', async () => {
      const dto = { email: 'admin@example.com', password: 'pw' };
      const result = await controller.registerAdmin(dto as any);

      expect(userService.register).toHaveBeenCalled();
      expect(result).toEqual(new CommonResponse(201, 'ADMIN 등록 성공'));
    });
  });

  describe('login', () => {
    it('로그인 성공 시 액세스 토큰과 리프레시 토큰 반환 테스트', async () => {
      const dto: LoginUserRequestDto = {
        email: 'user@example.com',
        password: 'pw',
      };

      const tokens: LoginResponseDto = {
        accessToken: 'ACCESS',
        refreshToken: 'REFRESH',
      };

      userService.login.mockResolvedValue(tokens);

      const result = await controller.login(dto);

      expect(userService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: dto.password,
        }),
      );

      expect(result).toEqual(new CommonResponse(201, '로그인 성공', tokens));
    });
  });
});
