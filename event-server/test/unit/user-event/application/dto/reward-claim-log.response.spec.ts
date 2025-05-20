import { RewardClaimLogResponse } from 'src/user-event/application/\bdto/reward-claim-log.response';

describe('RewardClaimLogResponse', () => {
  it('엔티티 값을 DTO로 올바르게 매핑해야 한다', () => {
    const entity = {
      eventId: '6647b865f8a4e95222c9fcab',
      email: 'user@example.com',
      rewardName: '100포션',
      amount: 3,
      status: 'FAILURE' as const,
      reason: '중복 요청입니다.',
      claimedAt: new Date('2025-05-19T12:34:56.000Z'),
    };

    const dto = new RewardClaimLogResponse(entity);

    expect(dto.eventId).toBe(entity.eventId);
    expect(dto.email).toBe(entity.email);
    expect(dto.rewardName).toBe(entity.rewardName);
    expect(dto.amount).toBe(entity.amount);
    expect(dto.status).toBe('FAILURE');
    expect(dto.reason).toBe('중복 요청입니다.');
    expect(dto.claimedAt.toISOString()).toBe('2025-05-19T12:34:56.000Z');
  });
});
