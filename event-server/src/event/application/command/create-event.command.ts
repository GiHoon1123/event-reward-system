export class CreateEventCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly conditionType: string,
    public readonly conditionValue: number,
    public readonly createdBy: string,
  ) {}
}
