export class GetAvailableRewardsQuery {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
  ) {}
}
