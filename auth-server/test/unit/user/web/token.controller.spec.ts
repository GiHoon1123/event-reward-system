import { Test, TestingModule } from '@nestjs/testing';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { AccessTokenResponseDto } from 'src/user/application/\bdto/access-token-response';
import { UserService } from 'src/user/application/user.service';
import { RefreshTokenRequestDto } from 'src/user/web/dto/refresh-token.request';
import { TokenController } from 'src/user/web/token.controller';

describe('TokenController', () => {
  let controller: TokenController;
  let userService: jest.Mocked<UserService>;

  // 테스트 실행 전 모듈 초기화
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: UserService,
          useValue: {
            refresh: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
    userService = module.get(UserService);
  });

  describe('refreshToken', () => {
    it('리프레시 토큰으로 새로운 액세스 토큰을 반환해야 한다', async () => {
      // 입력 DTO
      const dto: RefreshTokenRequestDto = {
        refreshToken: 'valid-refresh-token',
      };

      // 예상 결과
      const expected: AccessTokenResponseDto = {
        accessToken: 'new-access-token',
      };

      // userService.refresh 함수가 토큰을 반환하도록 설정
      userService.refresh.mockResolvedValue(expected);

      // 컨트롤러 실행
      const result = await controller.refreshToken(dto);

      // 서비스가 올바르게 호출되었는지 확인
      expect(userService.refresh).toHaveBeenCalledWith(dto.refreshToken);

      // 응답이 예상 결과와 일치하는지 확인
      expect(result).toEqual(
        new CommonResponse(201, 'Access Token 재발급 성공', expected),
      );
    });
  });
});
