export class GetAdminRewardHistoriesQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
