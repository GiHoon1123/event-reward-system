import { NotEventCreatorException } from 'src/common/exception/custom/not-event-creator.exception';
import { Reward } from './reward';

export type EventStatus = 'ACTIVE' | 'INACTIVE';
export type EventConditionType = 'LOGIN_COUNT';

export class Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly condition: {
      type: EventConditionType;
      value: number;
    },

    public readonly status: EventStatus,
    public readonly rewards: Reward[],
    public readonly createdBy: string,
    public readonly createdAt: Date,
  ) {}

  static of(
    title: string,
    description: string,
    conditionValue: number,
    createdBy: string,
  ): Event {
    return new Event(
      '', // 생성 시 ID는 비어 있음 (Mongo가 부여)
      title,
      description,
      { type: 'LOGIN_COUNT', value: conditionValue },
      'ACTIVE',
      [],
      createdBy,
      new Date(),
    );
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  isInActive(): boolean {
    return this.status == 'INACTIVE';
  }

  addRewards(rewards: Reward[], requester: string): void {
    if (requester !== this.createdBy) {
      throw new NotEventCreatorException();
    }
    this.rewards.push(...rewards);
  }
}
