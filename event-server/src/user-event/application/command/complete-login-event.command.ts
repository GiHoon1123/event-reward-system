export class CompleteLoginEventCommand {
  constructor(
    public readonly eventId: string,
    public readonly email: string,
  ) {}
}
