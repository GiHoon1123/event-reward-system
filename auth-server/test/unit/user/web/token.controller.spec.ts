// test/unit/user/web/token.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/application/user.service';
import { RefreshTokenRequestDto } from 'src/user/web/dto/refresh-token.request';
import { TokenController } from 'src/user/web/token.controller';

describe('TokenController', () => {
  let controller: TokenController;
  const mockUserService = {
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get(TokenController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshToken', () => {
    it('refreshToken으로 userService.refresh를 호출하고 결과를 CommonResponse로 감싸야 한다', async () => {
      const dto: RefreshTokenRequestDto = {
        refreshToken: 'valid-refresh-token',
      };

      const mockResult = {
        accessToken: 'new-access-token',
      };

      mockUserService.refresh.mockResolvedValue(mockResult);

      const result = await controller.refreshToken(dto);

      expect(mockUserService.refresh).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
      expect(result).toEqual({
        statusCode: 201,
        message: 'Access Token 재발급 성공',
        data: mockResult,
      });
    });
  });
});
