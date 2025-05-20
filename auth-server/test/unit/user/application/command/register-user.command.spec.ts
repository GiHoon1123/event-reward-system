import { RegisterUserCommand } from 'src/user/application/\bcommand/register-user.command';
import { Role } from 'src/user/domain/user';

describe('RegisterUserCommand', () => {
  it('유효한 커맨드 객체가 생성되어야 한다.', () => {
    const email = 'user@example.com';
    const password = 'securePassword123!';
    const role = Role.ADMIN;

    const command = new RegisterUserCommand(email, password, role);

    expect(command.email).toBe(email);
    expect(command.password).toBe(password);
    expect(command.role).toBe(role);
  });
});
