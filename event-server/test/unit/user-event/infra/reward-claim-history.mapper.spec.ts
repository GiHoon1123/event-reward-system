import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';
import { RewardHistorySubdocument } from 'src/user-event/infra/reward-claim-history.entity';
import { RewardClaimHistoryMapper } from 'src/user-event/infra/reward-claim-history.mapper';

describe('RewardClaimHistoryMapper', () => {
  const baseData = {
    rewardName: '코어 잼스톤',
    amount: 100,
    status: 'SUCCESS' as const,
    claimedAt: new Date(),
    requestId: 'req-uuid-123',
    reason: '이미 수령됨',
  };

  describe('toEntity', () => {
    it('도메인 → subdocument entity 객체로 변환할 수 있어야 한다', () => {
      const domain = new RewardClaimHistory(
        baseData.rewardName,
        baseData.amount,
        baseData.status,
        baseData.requestId,
        baseData.claimedAt,
        baseData.reason,
      );

      const entity = RewardClaimHistoryMapper.toEntity(domain);

      expect(entity).toEqual({
        rewardName: baseData.rewardName,
        amount: baseData.amount,
        status: baseData.status,
        claimedAt: baseData.claimedAt,
        requestId: baseData.requestId,
        reason: baseData.reason,
      });
    });

    it('reason이 없을 경우에도 정상 변환되어야 한다', () => {
      const domain = new RewardClaimHistory(
        baseData.rewardName,
        baseData.amount,
        baseData.status,
        baseData.requestId,
        baseData.claimedAt,
      );

      const entity = RewardClaimHistoryMapper.toEntity(domain);

      expect(entity.reason).toBeUndefined();
    });
  });

  describe('toDomain', () => {
    it('subdocument entity → 도메인 객체로 변환할 수 있어야 한다', () => {
      const entity: RewardHistorySubdocument = {
        rewardName: baseData.rewardName,
        amount: baseData.amount,
        status: baseData.status,
        claimedAt: baseData.claimedAt,
        requestId: baseData.requestId,
        reason: baseData.reason,
      };

      const domain = RewardClaimHistoryMapper.toDomain(entity);

      expect(domain).toBeInstanceOf(RewardClaimHistory);
      expect(domain.rewardName).toBe(baseData.rewardName);
      expect(domain.amount).toBe(baseData.amount);
      expect(domain.status).toBe('SUCCESS');
      expect(domain.reason).toBe(baseData.reason);
    });
  });
});
