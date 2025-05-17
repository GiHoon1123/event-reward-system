export class EventStatusChangeCommand {
  constructor(
    public readonly eventId: string,
    public readonly status: 'ACTIVE' | 'INACTIVE',
    public readonly email: string,
  ) {}
}
