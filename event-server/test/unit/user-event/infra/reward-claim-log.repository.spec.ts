import { ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { RewardClaimLogEntity } from 'src/user-event/infra/reward-claim-log.entity';
import { RewardClaimLogRepository } from 'src/user-event/infra/reward-claim-log.repository';

describe('RewardClaimLogRepository', () => {
  let repository: RewardClaimLogRepository;
  let mockModel: Partial<Record<keyof Model<RewardClaimLogEntity>, jest.Mock>>;

  const sampleLog = {
    email: 'user@example.com',
    eventId: 'event123',
    rewardName: '코어 잼스톤',
    amount: 50,
    status: 'SUCCESS' as const,
    requestId: 'req-unique-123',
    claimedAt: new Date(),
    reason: undefined,
  };

  beforeEach(() => {
    mockModel = {
      create: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
    };
    repository = new RewardClaimLogRepository(mockModel as any);
  });

  it('saveLog() - 정상 저장 호출', async () => {
    await repository.saveLog(sampleLog);
    expect(mockModel.create).toHaveBeenCalledWith(sampleLog);
  });

  it('saveLog() - 중복일 경우 ConflictException을 던져야 한다', async () => {
    mockModel.create!.mockRejectedValueOnce({ code: 11000 });
    await expect(repository.saveLog(sampleLog)).rejects.toThrow(
      ConflictException,
    );
  });

  it('findAllWithPage() - 전체 로그 목록과 개수를 반환한다', async () => {
    mockModel.find!.mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({ exec: jest.fn().mockResolvedValueOnce([sampleLog]) }),
        }),
      }),
    });
    mockModel.countDocuments!.mockResolvedValueOnce(1);

    const result = await repository.findAllWithPage(1, 10);
    expect(result.totalCount).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('findByUserWithPage() - 특정 유저 기준 로그 목록과 개수를 반환한다', async () => {
    mockModel.find!.mockReturnValueOnce({
      sort: () => ({
        skip: () => ({
          limit: () => ({ exec: jest.fn().mockResolvedValueOnce([sampleLog]) }),
        }),
      }),
    });
    mockModel.countDocuments!.mockResolvedValueOnce(1);

    const result = await repository.findByUserWithPage(
      'user@example.com',
      1,
      10,
    );
    expect(result.totalCount).toBe(1);
    expect(result.items[0].email).toBe('user@example.com');
  });
});
