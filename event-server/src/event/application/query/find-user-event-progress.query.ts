// src/event/application/port/in/query/find-user-event-progress.query.ts

export class FindUserEventProgressQuery {
  constructor(
    public readonly eventId: string,
    public readonly userEmail: string,
  ) {}
}
