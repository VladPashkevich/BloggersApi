import { UserAccountOnType, UsersType } from './ip-type';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAccountOnType | null;
    }
  }
}
