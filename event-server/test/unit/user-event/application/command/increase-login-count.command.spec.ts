import { IncreaseLoginCountCommand } from 'src/user-event/application/command/increase-login-count.command';

describe('IncreaseLoginCountCommand', () => {
  it('이메일이 정상적으로 저장되어야 한다', () => {
    const email = 'test@example.com';
    const command = new IncreaseLoginCountCommand(email);

    expect(command.email).toBe(email);
  });
});
