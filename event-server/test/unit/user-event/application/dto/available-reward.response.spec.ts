import { AvailableRewardResponse } from 'src/user-event/application/\bdto/available-reward.response';

describe('AvailableRewardResponse', () => {
  it('보상 정보를 올바르게 저장해야 한다', () => {
    const reward = new AvailableRewardResponse('극한성장의 비약', 'ITEM', 2);

    expect(reward.name).toBe('극한성장의 비약');
    expect(reward.type).toBe('ITEM');
    expect(reward.availableAmount).toBe(2);
  });
});
