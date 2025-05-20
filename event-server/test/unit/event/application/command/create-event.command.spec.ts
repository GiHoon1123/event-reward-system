import { CreateEventCommand } from 'src/event/application/command/create-event.command';

describe('CreateEventCommand', () => {
  it('이벤트 생성에 필요한 필드를 모두 포함하여 생성되어야 한다', () => {
    const command = new CreateEventCommand(
      '출석 이벤트',
      '3일 연속 로그인 시 보상 지급',
      'LOGIN_COUNT',
      3,
      'creator@example.com',
    );

    expect(command.title).toBe('출석 이벤트');
    expect(command.description).toBe('3일 연속 로그인 시 보상 지급');
    expect(command.conditionType).toBe('LOGIN_COUNT');
    expect(command.conditionValue).toBe(3);
    expect(command.createdBy).toBe('creator@example.com');
  });
});
