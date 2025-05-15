// src/event/application/command/create-event.command.ts

export class CreateEventCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly conditionValue: number,
    public readonly createdBy: string,
  ) {}
}
