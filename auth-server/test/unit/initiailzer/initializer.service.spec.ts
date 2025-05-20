import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { InitializerService } from 'src/initializer/initializer.service';
import { UserService } from 'src/user/application/user.service';

jest.mock('bcrypt');

describe('InitializerService', () => {
  let service: InitializerService;
  let userService: UserService;

  const mockUserService = {
    createAdmin: jest.fn(),
  };

  beforeEach(async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'securepassword';

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitializerService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get(InitializerService);
    userService = module.get(UserService);
  });

  it('onModuleInit() 실행 시 createAdmin이 호출돼야 한다', async () => {
    await service.onModuleInit();

    expect(userService.createAdmin).toHaveBeenCalledWith(
      'admin@example.com',
      'securepassword',
    );
  });
});
