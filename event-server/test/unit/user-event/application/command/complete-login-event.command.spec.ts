import { CompleteLoginEventCommand } from 'src/user-event/application/command/complete-login-event.command';

describe('CompleteLoginEventCommand', () => {
  it('eventId와 email이 올바르게 저장되어야 한다', () => {
    const command = new CompleteLoginEventCommand(
      'event123',
      'user@example.com',
    );

    expect(command.eventId).toBe('event123');
    expect(command.email).toBe('user@example.com');
  });
});
