export class GetProgressInfoQuery {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
  ) {}
}
