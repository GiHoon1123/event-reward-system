import { Role, User } from 'src/user/domain/user';
import { UserRepository } from 'src/user/infra/user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  const mockUserModel = {
    exists: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(() => {
    repository = new UserRepository(mockUserModel as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('existsByEmail', () => {
    it('이메일이 존재하면 true 반환', async () => {
      mockUserModel.exists.mockResolvedValue({ _id: '123' });
      const result = await repository.existsByEmail('test@example.com');
      expect(result).toBe(true);
      expect(mockUserModel.exists).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('이메일이 없으면 false 반환', async () => {
      mockUserModel.exists.mockResolvedValue(null);
      const result = await repository.existsByEmail('none@example.com');
      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('도메인 유저를 저장하고 도메인으로 반환해야 한다', async () => {
      const domainUser = User.of('user@example.com', 'pw123', Role.USER);
      const savedUser = {
        _id: { toString: () => 'abc123' },
        email: domainUser.email,
        password: domainUser.password,
        role: domainUser.role,
        refreshToken: null,
        save: jest.fn().mockResolvedValue({
          _id: { toString: () => 'abc123' },
          email: domainUser.email,
          password: domainUser.password,
          role: domainUser.role,
          refreshToken: null,
        }),
      };

      const mockModelConstructor = jest
        .fn()
        .mockImplementation(() => savedUser);
      repository = new UserRepository(mockModelConstructor as any);

      const result = await repository.save(domainUser);
      expect(savedUser.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(domainUser.email);
    });
  });

  describe('findByEmail', () => {
    it('이메일로 유저 찾고 도메인으로 변환', async () => {
      mockUserModel.findOne.mockResolvedValue({
        _id: { toString: () => 'id' },
        email: 'a@a.com',
        password: 'pw',
        role: Role.USER,
        refreshToken: null,
      });

      const result = await repository.findByEmail('a@a.com');
      expect(result?.email).toBe('a@a.com');
    });

    it('없으면 null 반환', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      const result = await repository.findByEmail('none@a.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('ID로 유저 찾고 도메인으로 변환', async () => {
      mockUserModel.findById.mockResolvedValue({
        _id: { toString: () => 'uid' },
        email: 'b@b.com',
        password: 'pw',
        role: Role.USER,
        refreshToken: null,
      });

      const result = await repository.findById('uid');
      expect(result?.id).toBe('uid');
    });

    it('ID가 없으면 null 반환', async () => {
      mockUserModel.findById.mockResolvedValue(null);
      const result = await repository.findById('xxx');
      expect(result).toBeNull();
    });
  });

  describe('updateRefreshToken', () => {
    it('refreshToken을 업데이트해야 한다', async () => {
      await repository.updateRefreshToken('uid', 'new-refresh');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('uid', {
        refreshToken: 'new-refresh',
      });
    });
  });

  describe('updateRoleByEmail', () => {
    it('역할을 이메일 기준으로 업데이트해야 한다', async () => {
      await repository.updateRoleByEmail('user@example.com', Role.ADMIN);
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        { $set: { role: Role.ADMIN } },
      );
    });
  });
});
