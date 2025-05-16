export class FindUserEventProgressQuery {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
  ) {}
}
