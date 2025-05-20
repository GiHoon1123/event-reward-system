export class GetUserRewardHistoriesQuery {
  constructor(
    public readonly email: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
