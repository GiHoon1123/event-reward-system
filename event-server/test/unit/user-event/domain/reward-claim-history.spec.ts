import { RewardClaimHistory } from 'src/user-event/domain/reward-claim-history';

describe('RewardClaimHistory 도메인 (역정규화)', () => {
  const baseData = {
    rewardName: '코어 잼스톤',
    amount: 100,
    requestId: 'req-uuid-123',
  };

  describe('success()', () => {
    it('성공 상태의 RewardClaimHistory를 생성한다', () => {
      const history = RewardClaimHistory.success(
        baseData.rewardName,
        baseData.amount,
        baseData.requestId,
      );

      expect(history.rewardName).toBe(baseData.rewardName);
      expect(history.amount).toBe(baseData.amount);
      expect(history.status).toBe('SUCCESS');
      expect(history.requestId).toBe(baseData.requestId);
      expect(history.claimedAt).toBeInstanceOf(Date);
      expect(history.reason).toBeUndefined();
    });
  });

  describe('failure()', () => {
    it('실패 상태의 RewardClaimHistory를 생성한다', () => {
      const reason = '조건 미충족';
      const history = RewardClaimHistory.failure(
        baseData.rewardName,
        baseData.amount,
        reason,
        baseData.requestId,
      );

      expect(history.rewardName).toBe(baseData.rewardName);
      expect(history.amount).toBe(baseData.amount);
      expect(history.status).toBe('FAILURE');
      expect(history.reason).toBe(reason);
      expect(history.requestId).toBe(baseData.requestId);
      expect(history.claimedAt).toBeInstanceOf(Date);
    });
  });
});
