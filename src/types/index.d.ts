import { UserAccountOnType, UsersType, UsersSchema, UserAccountDBType } from './users-type';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAccountOnType | null;
    }
  }
}
