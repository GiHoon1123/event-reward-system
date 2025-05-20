export class GetEventListQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
