import { LoginCommand } from 'src/user/application/\bcommand/login.command';

describe('LoginCommand', () => {
  it('유효한 커맨드 객체가 생성되어야 한다.', () => {
    const email = 'user@example.com';
    const password = 'securePassword123!';

    const command = new LoginCommand(email, password);

    expect(command.email).toBe(email);
    expect(command.password).toBe(password);
  });
});
