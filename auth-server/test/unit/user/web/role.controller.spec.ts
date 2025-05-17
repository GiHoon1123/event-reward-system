// test/unit/user/web/role.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/application/user.service';
import { Role } from 'src/user/domain/user';
import { UpdateUserRoleRequestDto } from 'src/user/web/dto/update-user-role.request';
import { RoleController } from 'src/user/web/role.controller';

describe('RoleController', () => {
  let controller: RoleController;
  const mockUserService = {
    changeRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get(RoleController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('changeUserRole', () => {
    it('UserService.changeRole을 호출하고 CommonResponse를 반환해야 한다', async () => {
      const dto: UpdateUserRoleRequestDto = {
        email: 'user@example.com',
        role: Role.ADMIN,
      };

      const result = await controller.changeUserRole(dto);

      expect(mockUserService.changeRole).toHaveBeenCalledWith(
        dto.email,
        dto.role,
      );

      expect(result).toMatchObject({
        statusCode: 201,
        message: '역할 변경 성공',
      });
    });
  });
});
