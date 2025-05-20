import { EventStatusChangeCommand } from 'src/event/application/command/event-status-chagne-command';

describe('EventStatusChangeCommand', () => {
  it('이벤트 ID, 변경할 상태, 요청자 이메일 정보를 포함하여 생성되어야 한다', () => {
    const command = new EventStatusChangeCommand(
      'event123',
      'INACTIVE',
      'admin@example.com',
    );

    expect(command.eventId).toBe('event123');
    expect(command.status).toBe('INACTIVE');
    expect(command.email).toBe('admin@example.com');
  });
});
