import { Test, TestingModule } from '@nestjs/testing';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ChangeUserRoleCommand } from 'src/user/application/\bcommand/change-user-role.command';
import { UserService } from 'src/user/application/user.service';
import { Role } from 'src/user/domain/user';
import { UpdateUserRoleRequestDto } from 'src/user/web/dto/update-user-role.request';
import { RoleController } from 'src/user/web/role.controller';

describe('RoleController', () => {
  let controller: RoleController;
  let userService: jest.Mocked<UserService>;

  // 매 테스트 실행 전 모듈 초기화
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: UserService,
          useValue: {
            changeRole: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    userService = module.get(UserService);
  });

  describe('changeUserRole', () => {
    it('유저의 역할을 변경하고 성공 응답을 반환해야 한다', async () => {
      // 테스트 입력값 준비
      const dto: UpdateUserRoleRequestDto = {
        email: 'user@example.com',
        role: Role.AUDITOR,
      };

      // 컨트롤러 메서드 호출
      const result = await controller.changeUserRole(dto);

      // userService.changeRole이 올바른 커맨드로 호출되었는지 확인
      expect(userService.changeRole).toHaveBeenCalledWith(
        new ChangeUserRoleCommand(dto.email, dto.role),
      );

      // 반환 값이 올바른지 확인
      expect(result).toEqual(new CommonResponse(201, '역할 변경 성공'));
    });
  });
});
