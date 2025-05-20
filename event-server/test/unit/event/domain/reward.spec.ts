// test/unit/event/domain/reward.spec.ts

import { Reward } from 'src/event/domain/reward';

describe('Reward', () => {
  it('정적 팩토리 메서드로 보상을 생성할 수 있다', () => {
    const reward = Reward.create('포션', 100);

    expect(reward.type).toBe('ITEM');
    expect(reward.name).toBe('포션');
    expect(reward.amount).toBe(100);
  });

  it('생성자를 직접 호출해도 보상이 생성되어야 한다', () => {
    const reward = new Reward('ITEM', '골드', 500);

    expect(reward.name).toBe('골드');
    expect(reward.amount).toBe(500);
    expect(reward.type).toBe('ITEM');
  });
});
