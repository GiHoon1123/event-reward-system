import { InvalidRoleException } from 'src/common/exception/custom/invalid-role.exception';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export class User {
  constructor(
    public readonly id: string | null,
    public readonly email: string,
    public readonly password: string,
    public role: Role = Role.USER,
    public refreshToken: string | null = null,
  ) {}

  static of(email: string, password: string, role: Role = Role.USER): User {
    return new User(null, email, password, role);
  }

  static toDomain(
    id: string,
    email: string,
    password: string,
    role: Role,
    refreshToken: string | null,
  ): User {
    return new User(id, email, password, role, refreshToken);
  }

  changeRole(newRole: Role) {
    if (!Object.values(Role).includes(newRole)) {
      throw new InvalidRoleException();
    }
    this.role = newRole;
  }
}
