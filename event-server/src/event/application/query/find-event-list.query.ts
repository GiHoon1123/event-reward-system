// src/event/application/port/in/query/find-event-list.query.ts

export class FindEventListQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
