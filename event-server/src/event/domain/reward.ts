export type RewardType = 'ITEM';

export class Reward {
  constructor(
    public readonly type: RewardType,
    public readonly name: string,
    public readonly amount: number,
  ) {}

  static create(name: string, amount: number): Reward {
    return new Reward('ITEM', name, amount);
  }
}
