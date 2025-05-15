export class FindUserEventProgressQuery {
  constructor(
    public readonly eventId: string,
    public readonly userEmail: string,
  ) {}
}
