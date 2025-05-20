import { Request } from 'express';
import { Role } from 'src/user/domain/user';

export interface RequestWithUser extends Request {
  user: {
    email: string;
    role: Role;
  };
}
