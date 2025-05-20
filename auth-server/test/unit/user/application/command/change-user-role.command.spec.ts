import { describe } from 'node:test';
import { ChangeUserRoleCommand } from 'src/user/application/\bcommand/change-user-role.command';
import { Role } from 'src/user/domain/user';

describe('ChangeUserRoleCommand', () => {
  it('이메일과 역할이 올바르게 설정되는지 확인', () => {
    const email = 'user@example.com';
    const newRole = Role.OPERATOR;

    const command = new ChangeUserRoleCommand(email, newRole);

    expect(command.email).toBe(email);
    expect(command.newRole).toBe(newRole);
  });
});
