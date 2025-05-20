import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserLoginEventProgress } from 'src/user-event/domain/user-login-event-progress';
import { UserLoginEventProgressEntity } from 'src/user-event/infra/user-login-event-progress.entity';
import { UserLoginEventProgressRepository } from 'src/user-event/infra/user-login-event-progress.repository';

describe('UserLoginEventProgressRepository', () => {
  let repository: UserLoginEventProgressRepository;
  let mockModel: Partial<
    Record<keyof Model<UserLoginEventProgressEntity>, jest.Mock>
  >;

  const email = 'user@example.com';
  const domainObject = new UserLoginEventProgress(email, 3, 'IN_PROGRESS');

  beforeEach(() => {
    mockModel = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };

    repository = new UserLoginEventProgressRepository(mockModel as any);
  });

  describe('findByUserEmail', () => {
    it('존재하는 경우 도메인 객체로 반환해야 한다', async () => {
      mockModel.findOne!.mockResolvedValueOnce({
        email,
        loginCount: 3,
        status: 'IN_PROGRESS',
      });

      const result = await repository.findByUserEmail(email);

      expect(result).toBeInstanceOf(UserLoginEventProgress);
      expect(result.email).toBe(email);
    });

    it('존재하지 않는 경우 null을 반환해야 한다', async () => {
      mockModel.findOne!.mockResolvedValueOnce(null);
      const result = await repository.findByUserEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('findByUserEmailOrThrow', () => {
    it('존재하면 도메인 객체로 반환한다', async () => {
      mockModel.findOne!.mockResolvedValueOnce({
        email,
        loginCount: 3,
        status: 'IN_PROGRESS',
      });

      const result = await repository.findByUserEmailOrThrow(email);

      expect(result.email).toBe(email);
      expect(result.getLoginCount()).toBe(3);
    });

    it('존재하지 않으면 NotFoundException을 던진다', async () => {
      mockModel.findOne!.mockResolvedValueOnce(null);

      await expect(repository.findByUserEmailOrThrow(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('save', () => {
    it('upsert 옵션으로 updateOne이 호출되어야 한다', async () => {
      mockModel.updateOne!.mockResolvedValueOnce({});

      await repository.save(domainObject);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { email },
        {
          $set: {
            email,
            loginCount: 3,
            status: 'IN_PROGRESS',
          },
        },
        { upsert: true },
      );
    });
  });
});
